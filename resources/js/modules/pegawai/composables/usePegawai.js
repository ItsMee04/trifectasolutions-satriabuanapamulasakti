import { ref, computed, reactive } from 'vue';
import { pegawaiService } from '../services/pegawaiService';
import { toastfy } from '@/utilities/toast';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

// Shared State
const pegawai = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formPegawai = reactive({
    id: null,
    nama: '',
    kontak: '',
    alamat: '',
    image: null,
});

export function usePegawai() {
    const authStore = useAuthStore(); // 2. Inisialisasi
    // Fungsi bantuan untuk merender URL gambar (Logika dari project lama Anda)
    const getImageUrl = (imageName) => {
        const folderPath = "/storage/pegawai/image/";
        // Jika ada nama file, arahkan ke storage, jika tidak pakai default avatar
        const imgSrc = (imageName && imageName !== "")
            ? `${folderPath}${imageName}`
            : "/assets/img/profiles/avatar-01.jpg";

        // Kita tambahkan timestamp (cache busting) agar saat upload foto baru langsung berubah
        const timestamp = new Date().getTime();
        return `${imgSrc}?t=${timestamp}`;
    };

    const fetchPegawai = async () => {
        isLoading.value = true;
        try {
            const response = await pegawaiService.getPegawai();
            pegawai.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            pegawai.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formPegawai.nama || formPegawai.nama.trim() === '') {
            errors.value.nama = 'Nama tidak boleh kosong.';
        }
        if (!formPegawai.kontak || formPegawai.kontak.trim() === '') {
            errors.value.kontak = 'Kontak tidak boleh kosong.';
        }
        if (!formPegawai.alamat || formPegawai.alamat.trim() === '') {
            errors.value.alamat = 'Alamat tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitPegawai = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = new FormData();
            payload.append('nama', formPegawai.nama);
            payload.append('kontak', formPegawai.kontak);
            payload.append('alamat', formPegawai.alamat);

            // Cek jika ada file gambar yang dipilih (bukan string nama file lama)
            if (formPegawai.image instanceof File) {
                payload.append('image', formPegawai.image);
            }

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.append('id', formPegawai.id);
                response = await pegawaiService.updatePegawai(payload);
                // ✨ SINKRONISASI KE HEADER
                // Jika ID yang diedit sama dengan ID user yang sedang login
                if (formPegawai.id === authStore.user?.id) {
                    authStore.updateProfile({
                        nama: formPegawai.nama,
                        // Ambil nama file gambar terbaru dari response backend
                        image: response.data.image
                    });
                }
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await pegawaiService.storePegawai(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalPegawai');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchPegawai();

            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                // Error validasi dari Laravel otomatis masuk ke state errors
                errors.value = error.response.data.errors;
            } else {
                console.error('Gagal menyimpan data Pegawai:', error);
                toastfy.error(error.response?.data?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleCreate = () => {
        isEdit.value = false;
        formPegawai.id = null;
        formPegawai.nama = '';
        formPegawai.kontak = '',
            formPegawai.alamat = '',
            errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalPegawai'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {}; // Bersihkan error sebelumnya

        // Isi form dengan data pegawai yang dipilih
        formPegawai.id = item.id;
        formPegawai.nama = item.nama;
        formPegawai.kontak = item.kontak;
        formPegawai.alamat = item.alamat;
        formPegawai.image = item.image; // Ini berisi string nama file, misal: "pegawai_1.jpg"

        const modal = new bootstrap.Modal(document.getElementById('modalPegawai'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Pegawi "${item.nama}" yang dihapus tidak dapat dikembalikan!`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true // Opsional: menukar posisi tombol Batal & Hapus
        });

        if (result.isConfirmed) {
            isLoading.value = true; // Set loading agar UI tetap konsisten [cite: 2025-10-25]
            try {
                // 📦 Siapkan Payload
                const payload = {
                    id: item.id,
                };
                // Mengirim payload id sesuai kebutuhan service Anda
                await pegawaiService.deletePegawai(payload);

                toastfy.success('Pegawai berhasil dihapus.');

                // Memanggil fetchPegawai agar tabel terupdate otomatis tanpa reload
                await fetchPegawai();
            } catch (error) {
                console.error('Gagal menghapus data Pegawai:', error);
                toastfy.error('Gagal menghapus data Pegawai.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchPegawai();
    }

    const resetForm = () => {
        formPegawai.id = null;
        formPegawai.nama = '';
        formPegawai.kontak = '';
        formPegawai.alamat = '';
        formPegawai.image = null;
        errors.value = {}; // Bersihkan pesan error juga
    };

    // --- Tambahkan Logic Pagination ---
    const totalPages = computed(() => {
        const filteredCount = pegawai.value.filter(item =>
            (item.nama || '').toLowerCase().includes(searchQuery.value.toLowerCase())
        ).length;

        // Hitung total halaman, minimal 1 halaman
        return Math.ceil(filteredCount / itemsPerPage) || 1;
    });

    const displayedPages = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const maxVisible = 5; // Jumlah nomor yang ingin ditampilkan

        let start = Math.max(current - Math.floor(maxVisible / 2), 1);
        let end = start + maxVisible - 1;

        if (end > total) {
            end = total;
            start = Math.max(end - maxVisible + 1, 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    });

    return {
        pegawai, isLoading, searchQuery, currentPage, isEdit, formPegawai, errors, resetForm, totalPages, displayedPages,
        filteredPegawai: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return pegawai.value.filter(item => (item.nama || '').toLowerCase().includes(query));
        }),
        paginatedPegawai: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (pegawai.value.filter(item => (item.nama || '').toLowerCase().includes(searchQuery.value.toLowerCase())))
                .slice(start, start + itemsPerPage);
        }),
        fetchPegawai, handleCreate, handleEdit, handleDelete, handleRefresh, getImageUrl, submitPegawai
    };
}
