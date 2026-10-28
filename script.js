 document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    renderBooks(booksList); // በመጀመሪያ ቋሚዎቹን በቅጽበት ማሳየት
    fetchBooksFromSupabase(); // ከዛ ከዳታቤዝ ማምጣት
    updateAuthUI();
    loadAnnouncement();
    renderBgList();
});

async function fetchBooksFromSupabase() {
    try {
        const { data, error } = await supabaseClient.from('books').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        if (data && data.length > 0) {
            booksList = data; // ዳታ ካለ በዳታቤዙ መረጃ መተካት
            renderBooks(booksList);
            renderAdminBooksList();
        }
    } catch (e) {
        console.error('Error fetching books:', e);
    }
}
