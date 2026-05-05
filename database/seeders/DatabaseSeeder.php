<?php

namespace Database\Seeders;

use App\Models\Jabatan;
use App\Models\Module;
use App\Models\Pegawai;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // --- 1. SEED JABATAN ---
        $direktur = Jabatan::create(['jabatan' => 'Direktur Utama', 'status' => 1]);
        $itSupport = Jabatan::create(['jabatan' => 'IT Support', 'status' => 1]);
        $logistik = Jabatan::create(['jabatan' => 'Staff Logistik', 'status' => 1]);

        // --- 2. SEED PEGAWAI ---
        $pegawaiAdmin = Pegawai::create([
            'nama' => 'Administrator Utama',
            'kontak' => '08123456789',
            'alamat' => 'Kantor Pusat',
            'jabatan_id' => $direktur->id,
            'status' => 1
        ]);

        $pegawaiStaff = Pegawai::create([
            'nama' => 'Budi Logistik',
            'kontak' => '08987654321',
            'alamat' => 'Gudang A',
            'jabatan_id' => $logistik->id,
            'status' => 1
        ]);

        // --- 3. SEED ROLE ---
        $adminRole = Role::create(['role' => 'Administrator', 'status' => 1]);
        $staffRole = Role::create(['role' => 'Staff', 'status' => 1]);

        // --- 4. SEED USERS ---
        $userAdmin = User::create([
            'email' => 'admin@admin.com',
            'password' => Hash::make('123'),
            'pegawai_id' => $pegawaiAdmin->id,
            'role_id' => $adminRole->id,
            'status' => 1,
        ]);

        $userStaff = User::create([
            'email' => 'staff@gmail.com',
            'password' => Hash::make('123'),
            'pegawai_id' => $pegawaiStaff->id,
            'role_id' => $staffRole->id,
            'status' => 1,
        ]);

        // --- 5. SEED MODULES ---
        $modManagement = Module::create(['module' => 'management', 'label' => 'Manajemen Data User', 'status' => 1]);
        $modMaster = Module::create(['module' => 'master', 'label' => 'Manajemen Data Master', 'status' => 1]);
        $modTimbangan = Module::create(['module' => 'timbangan', 'label' => 'Operasional Timbangan', 'status' => 1]);
        $modJarakHarga = Module::create(['module' => 'jarakdanharga', 'label' => 'Jarak & Harga', 'status' => 1]);
        $modKegiatan = Module::create(['module' => 'kegiatanarmada', 'label' => 'Kegiatan Armada', 'status' => 1]);
        $modInvoice = Module::create(['module' => 'invoice', 'label' => 'Invoice', 'status' => 1]);
        $modPenjualan = Module::create(['module' => 'penjualan', 'label' => 'Penjualan', 'status' => 1]);

        // --- 6. SEED PERMISSIONS (GRANULAR / PER MENU) ---
        $permissionsList = [
            // Management Permissions
            ['module_id' => $modManagement->id, 'nama_permission' => 'menu-role'],
            ['module_id' => $modManagement->id, 'nama_permission' => 'menu-pegawai'],
            ['module_id' => $modManagement->id, 'nama_permission' => 'menu-users'],

            // Master Permissions
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-driver'],
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-suplier'],
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-jeniskendaraan'],
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-kendaraan'],
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-kategori'],
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-material'],
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-beratjenis'],
            ['module_id' => $modMaster->id, 'nama_permission' => 'menu-masterplant'],

            // Timbangan Permissions
            ['module_id' => $modTimbangan->id, 'nama_permission' => 'menu-sc'],
            ['module_id' => $modTimbangan->id, 'nama_permission' => 'menu-cbp'],
            ['module_id' => $modTimbangan->id, 'nama_permission' => 'menu-amp'],

            // Jarak & Harga Permissions
            ['module_id' => $modJarakHarga->id, 'nama_permission' => 'menu-jarakharga-amp'],
            ['module_id' => $modJarakHarga->id, 'nama_permission' => 'menu-jarakharga-cbp'],
            ['module_id' => $modJarakHarga->id, 'nama_permission' => 'menu-jarakharga-sc'],

            // Single Menu Permissions
            ['module_id' => $modKegiatan->id, 'nama_permission' => 'menu-kegiatanarmada'],
            ['module_id' => $modPenjualan->id, 'nama_permission' => 'menu-penjualan'],

            // Invoice Permissions
            ['module_id' => $modInvoice->id, 'nama_permission' => 'menu-invoice-upah'],
            ['module_id' => $modInvoice->id, 'nama_permission' => 'menu-upah-tm'],
        ];

        foreach ($permissionsList as $p) {
            Permission::create([
                'module_id' => $p['module_id'],
                'nama_permission' => $p['nama_permission'],
                'status' => 1
            ]);
        }

        // --- 7. ATTACH PERMISSIONS KE USER (UBAC) ---

        // ADMIN: Mendapatkan SEMUA Permission yang ada
        $allPermissions = Permission::all();
        $userAdmin->permissions()->attach($allPermissions->pluck('id'));
    }
}
