<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\OperationalJournal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    private $categories = [
        'Sewa Tempat',
        'Listrik, Air & Internet',
        'Gaji & Komisi',
        'Peralatan & Perlengkapan',
        'Lain-lain'
    ];

    public function index(Request $request)
    {
        $query = Expense::query();

        // Search category or description
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('category', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Category filter
        if ($request->category) {
            $query->where('category', $request->category);
        }

        // Date range filter
        if ($request->start_date) {
            $query->whereDate('expense_date', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('expense_date', '<=', $request->end_date);
        }

        $expenses = $query->orderBy('expense_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Sum total of current filtered query (all matching pages, not just paginated)
        $totalAmount = $query->sum('amount');

        return Inertia::render('Admin/Expenses/Index', [
            'expenses'   => $expenses,
            'categories' => $this->categories,
            'totalAmount'=> (float) $totalAmount,
            'filters'    => $request->only(['search', 'category', 'start_date', 'end_date']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Expenses/Form', [
            'categories' => $this->categories,
        ]);
    }

    public function store(Request $request, OperationalJournal $journal)
    {
        $validated = $request->validate([
            'expense_date' => 'required|date',
            'category'     => 'required|string|max:255',
            'amount'       => 'required|numeric|min:0',
            'description'  => 'nullable|string',
        ]);

        $expense = Expense::create($validated);
        $journal->cash('expense', 'operational_expense', (float) $expense->amount, $expense, $expense->category.' - '.($expense->description ?: 'Pengeluaran bengkel'), $expense->expense_date);
        $journal->audit('create', 'expense', $expense, 'Pengeluaran bengkel dicatat.');

        return redirect()->route('admin.expenses.index')
            ->with('success', 'Pengeluaran baru berhasil dicatat.');
    }

    public function edit(Expense $expense)
    {
        return Inertia::render('Admin/Expenses/Form', [
            'expense'    => $expense,
            'categories' => $this->categories,
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'expense_date' => 'required|date',
            'category'     => 'required|string|max:255',
            'amount'       => 'required|numeric|min:0',
            'description'  => 'nullable|string',
        ]);

        $expense->update($validated);

        return redirect()->route('admin.expenses.index')
            ->with('success', 'Catatan pengeluaran berhasil diperbarui.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return redirect()->route('admin.expenses.index')
            ->with('success', 'Catatan pengeluaran berhasil dihapus.');
    }
}
