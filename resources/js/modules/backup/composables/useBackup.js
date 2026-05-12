import { ref, computed, reactive } from 'vue';
import { backupService } from '../services/backupService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const backups = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

export function useBackup() {

    const fetchBackup = async () => {
        isLoading.value = true;
        try {
            const response = await backupService.getBackups();
            backups.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            backups.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const handleCreate = async () => {

        const result = await Swal.fire({
            title: 'Generate Backup?',
            text: 'Backup database akan dibuat sekarang.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Backup!',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;
        isLoading.value = true;

        try {
            await backupService.storeBackup();
            toastfy.success('Backup database berhasil dibuat.');
            await fetchBackup();
        } catch (error) {
            console.error(error);
            toastfy.error('Gagal membuat backup database.');
        } finally {
            isLoading.value = false;
        }
    };

    const handleDownload = async (item) => {
        try {
            await backupService.downloadBackup(item.filename);
        } catch (error) {
            console.error(error);
            toastfy.error('Gagal download backup.');
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Backup "${item.filename}" yang dihapus tidak dapat dikembalikan!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        isLoading.value = true;

        try {
            await backupService.deleteBackup({
                id: item.id
            });
            toastfy.success('Backup berhasil dihapus.');
            await fetchBackup();
        } catch (error) {
            console.error('Gagal menghapus backup:', error);
            toastfy.error('Gagal menghapus backup.');
        } finally {
            isLoading.value = false;
        }
    };

    const handleRefresh = async () => {
        await fetchBackup();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = backups.value.filter(item =>
            (item.filename || '').toLowerCase().includes(query)
        ).length;

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
        backups, isLoading, searchQuery, currentPage, isEdit, errors, totalPages, displayedPages,
        filteredBackup: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return backups.value.filter(item => (item.filename || '').toLowerCase().includes(query));
        }),
        paginatedBackup: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (backups.value.filter(item => (item.filename || '').toLowerCase().includes(searchQuery.value.toLowerCase())))
                .slice(start, start + itemsPerPage);
        }),
        fetchBackup, handleCreate, handleDelete, handleRefresh, handleDownload
    };
}
