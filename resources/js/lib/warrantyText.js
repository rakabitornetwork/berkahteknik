const DEFAULT_POLICY = 'Garansi suku cadang berlaku sesuai ketentuan bengkel. Klaim garansi wajib disertai nota ini.';

export function warrantyText(shop) {
    const policy = String(shop?.warranty_policy || '').trim();
    return policy || DEFAULT_POLICY;
}
