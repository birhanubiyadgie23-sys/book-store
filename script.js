import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { tx_ref, order_id } = await req.json()
    const CHAPA_SECRET_KEY = 'CHAPA_TEST_PRIV_YpC-HdtSIl2sNkt5HDCDTdDzvCXqLsi8GELpofen';

    // 1. ከ Chapa ሰርቨር ጋር በመገናኘት ክፍያው መፈጸሙን ማረጋገጥ
    const chapaRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`
      }
    });

    const chapaData = await chapaRes.json();

    if (chapaData.status === 'success') {
      // 2. ክፍያው ከተሳካ በ Supabase ውስጥ የትዕዛዙን ሁኔታ ወደ 'completed' መቀየር
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', order_id);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      return new Response(JSON.stringify({ success: true, message: 'ክፍያው ተረጋግጧል!' }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'ክፍያው አልተሳካም' }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
    <!-- JAVASCRIPT LOGIC -->
    <script>
        const SUPABASE_URL = 'https://dmjpbujthqprvpszgcrs.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtanBidWp0aHFwcnZwc3pnY3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMTA5ODgsImV4cCI6MjEwODU4Njk4OH0.1pciufqyTB71Q6qlYus3crxbs8pOqDYwWIyk72Kkico';
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        let booksList = [];
        let cart = [];
        let currentUser = JSON.parse(localStorage.getItem('yichalal_user')) || null;
        let backgroundImages = JSON.parse(localStorage.getItem('yichalal_hero_bgs')) || [
            'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1920&q=80'
        ];
        let currentSlideIndex = 0;

        document.addEventListener('DOMContentLoaded', () => {
            initSlideshow();
            fetchBooks();
            updateAuthUI();
            loadAnnouncement();
        });

        // 1. Slideshow
        function initSlideshow() {
            const container = document.getElementById('slideshow-container');
            const indicators = document.getElementById('slide-indicators');
            if (!container) return;

            container.innerHTML = '';
            indicators.innerHTML = '';

            backgroundImages.forEach((url, idx) => {
                const slide = document.createElement('div');
                slide.className = `absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${idx === 0 ? 'opacity-100 animate-kenburns' : 'opacity-0'}`;
                slide.style.backgroundImage = `url('${url}')`;
                slide.id = `hero-slide-${idx}`;
                container.appendChild(slide);

                const dot = document.createElement('button');
                dot.className = `w-2.5 h-2.5 rounded-full transition-all ${idx === 0 ? 'bg-indigo-600 w-6' : 'bg-slate-300'}`;
                dot.onclick = () => setSlide(idx);
                dot.id = `slide-dot-${idx}`;
                indicators.appendChild(dot);
            });

            setInterval(() => {
                currentSlideIndex = (currentSlideIndex + 1) % backgroundImages.length;
                setSlide(currentSlideIndex);
            }, 6000);
        }

        function setSlide(index) {
            backgroundImages.forEach((_, idx) => {
                const slide = document.getElementById(`hero-slide-${idx}`);
                const dot = document.getElementById(`slide-dot-${idx}`);
                if (slide && dot) {
                    if (idx === index) {
                        slide.className = 'absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out opacity-100 animate-kenburns';
                        dot.className = 'w-6 h-2.5 rounded-full bg-indigo-600 transition-all';
                    } else {
                        slide.className = 'absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out opacity-0';
                        dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-300 transition-all';
                    }
                }
            });
            currentSlideIndex = index;
        }

        // 2. Books Fetch & Render
        async function fetchBooks() {
            try {
                const { data, error } = await supabaseClient.from('books').select('*');
                if (error || !data || data.length === 0) {
                    booksList = [
                        { id: '1', title: 'የስኬት ሚስጥራት', author: 'በቀደመጌን', price: 350, category: 'ራስን ማነፅ', cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', rating: 4.9 },
                        { id: '2', title: 'የቴክኖሎጂ አብዮት', author: 'ብርሃኑ ቢያድጌ', price: 420, category: 'ቴክኖሎጂ', cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80', rating: 4.8 }
                    ];
                } else {
                    booksList = data;
                }
            } catch (e) {
                booksList = [];
            }
            renderBooks(booksList);
            renderAdminBooksList();
        }

        function renderBooks(list) {
            const grid = document.getElementById('books-grid');
            if (list.length === 0) {
                grid.innerHTML = '<p class="col-span-full py-12 text-center text-slate-400">ምንም መጽሐፍ አልተገኘም።</p>';
                return;
            }

            grid.innerHTML = list.map(book => `
                <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div>
                        <div class="overflow-hidden rounded-xl mb-3 bg-slate-100 h-52 relative">
                            <img src="${book.cover_image_url || 'https://via.placeholder.com/300'}" alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            <span class="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-amber-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-100 shadow-sm">
                                ★ ${book.rating || 4.8}
                            </span>
                        </div>
                        <span class="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">${book.category || 'መጽሐፍ'}</span>
                        <h3 class="font-bold font-serif text-slate-900 text-base mt-2 line-clamp-1">${book.title}</h3>
                        <p class="text-xs text-slate-500 mb-3">ደራሲ፡ ${book.author}</p>
                    </div>
                    <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span class="font-extrabold text-slate-900 text-sm">${book.price} ብር</span>
                        <button onclick="addToCart('${book.id}')" class="bg-slate-900 hover:bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-cart-plus text-amber-400"></i>
                            <span>ወደ ቅርጫት</span>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // 3. Auth Management (Login / Signup)
        function openAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
        function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }

        function switchAuthTab(tab) {
            const loginBtn = document.getElementById('tab-login-btn');
            const signupBtn = document.getElementById('tab-signup-btn');
            const loginForm = document.getElementById('form-login');
            const signupForm = document.getElementById('form-signup');

            if (tab === 'login') {
                loginBtn.className = 'w-1/2 py-2 rounded-lg bg-white text-indigo-600 shadow-sm transition';
                signupBtn.className = 'w-1/2 py-2 rounded-lg text-slate-600 transition';
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
            } else {
                signupBtn.className = 'w-1/2 py-2 rounded-lg bg-white text-indigo-600 shadow-sm transition';
                loginBtn.className = 'w-1/2 py-2 rounded-lg text-slate-600 transition';
                signupForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            }
        }

        async function handleLogin() {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            if (!username || !password) return alert('እባክዎ መረጃዎችን ይሙሉ');

            try {
                // Check Admins first
                const { data: adminData } = await supabaseClient.from('admins').select('*').eq('username', username).eq('password', password).maybeSingle();
                if (adminData) {
                    currentUser = { username: adminData.username, role: 'admin' };
                    localStorage.setItem('yichalal_user', JSON.stringify(currentUser));
                    closeAuthModal();
                    updateAuthUI();
                    alert('እንኳን ደህና መጡ አድሚን!');
                    return;
                }

                // Check Regular Users
                const { data: userData } = await supabaseClient.from('users').select('*').eq('username', username).eq('password', password).maybeSingle();
                if (userData) {
                    currentUser = { username: userData.username, role: 'customer', name: userData.full_name };
                    localStorage.setItem('yichalal_user', JSON.stringify(currentUser));
                    closeAuthModal();
                    updateAuthUI();
                    alert(`እንኳን ደህና መጡ ${userData.full_name}!`);
                    return;
                }

                alert('የተሳሳተ መረጃ!');
            } catch (err) {
                alert('ስህተት ተፈጥሯል: ' + err.message);
            }
        }

        async function handleSignup() {
            const fullName = document.getElementById('signup-name').value.trim();
            const username = document.getElementById('signup-username').value.trim();
            const password = document.getElementById('signup-password').value.trim();

            if (!fullName || !username || !password) return alert('እባክዎ ሁሉንም መስኮች ይሙሉ');

            try {
                const { error } = await supabaseClient.from('users').insert([{ full_name: fullName, username, password, role: 'customer' }]);
                if (error) throw error;

                currentUser = { username, role: 'customer', name: fullName };
                localStorage.setItem('yichalal_user', JSON.stringify(currentUser));
                closeAuthModal();
                updateAuthUI();
                alert('ምዝገባዎ ተሳክቷል!');
            } catch (err) {
                alert('ምዝገባ አልተሳካም (ስም ሊመሳሰል ይችላል): ' + err.message);
            }
        }

        function logout() {
            currentUser = null;
            localStorage.removeItem('yichalal_user');
            updateAuthUI();
            alert('ውጣ መውጣት ተሳክቷል');
        }

        function updateAuthUI() {
            const area = document.getElementById('auth-action-area');
            if (!currentUser) {
                area.innerHTML = `<button onclick="openAuthModal()" class="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm flex items-center gap-1.5"><i class="fa-solid fa-user"></i><span>ሎግ ኢን / ምዝገባ</span></button>`;
            } else if (currentUser.role === 'admin') {
                area.innerHTML = `
                    <div class="flex items-center gap-2">
                        <button onclick="openAdminModal()" class="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition border border-indigo-200"><i class="fa-solid fa-sliders"></i> ፓነል</button>
                        <button onclick="logout()" class="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl"><i class="fa-solid fa-right-from-bracket"></i></button>
                    </div>`;
            } else {
                area.innerHTML = `
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-700 hidden sm:inline">👤 ${currentUser.name || currentUser.username}</span>
                        <button onclick="logout()" class="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl"><i class="fa-solid fa-right-from-bracket"></i></button>
                    </div>`;
            }
        }

        // 4. Admin Dashboard Management
        function openAdminModal() { document.getElementById('admin-modal').classList.remove('hidden'); }
        function closeAdminModal() { document.getElementById('admin-modal').classList.add('hidden'); }

        function switchAdminTab(tab) {
            ['books', 'bg', 'announcement'].forEach(t => {
                document.getElementById(`adm-tab-${t}`).classList.add('hidden');
                document.getElementById(`adm-tab-${t}-btn`).className = 'px-3 py-1.5 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700';
            });
            document.getElementById(`adm-tab-${tab}`).classList.remove('hidden');
            document.getElementById(`adm-tab-${tab}-btn`).className = 'px-3 py-1.5 rounded-xl font-semibold text-xs bg-indigo-600 text-white';
        }

        async function saveBook() {
            const id = document.getElementById('edit-book-id').value;
            const title = document.getElementById('new-book-title').value;
            const author = document.getElementById('new-book-author').value;
            const price = parseFloat(document.getElementById('new-book-price').value);
            const category = document.getElementById('new-book-category').value;
            const cover_image_url = document.getElementById('new-book-cover').value;

            if (!title || !author || !price) return alert('እባክዎ አስፈላጊ መረጃዎችን ይሙሉ');

            const bookData = { title, author, price, category, cover_image_url, rating: 5.0 };

            try {
                if (id) {
                    await supabaseClient.from('books').update(bookData).eq('id', id);
                    alert('መጽሐፉ ተስተካክሏል!');
                } else {
                    await supabaseClient.from('books').insert([bookData]);
                    alert('መጽሐፉ ተመዝግቧል!');
                }
                resetBookForm();
                fetchBooks();
            } catch (err) {
                alert('ስህተት: ' + err.message);
            }
        }

        function editBook(id, title, author, price, category, cover) {
            document.getElementById('edit-book-id').value = id;
            document.getElementById('new-book-title').value = title;
            document.getElementById('new-book-author').value = author;
            document.getElementById('new-book-price').value = price;
            document.getElementById('new-book-category').value = category;
            document.getElementById('new-book-cover').value = cover;
            document.getElementById('book-form-title').textContent = 'መጽሐፍ ማሻሻያ (Edit)';
            document.getElementById('book-save-btn').textContent = 'ለውጦችን አዘምን';
        }

        function resetBookForm() {
            document.getElementById('edit-book-id').value = '';
            document.getElementById('new-book-title').value = '';
            document.getElementById('new-book-author').value = '';
            document.getElementById('new-book-price').value = '';
            document.getElementById('new-book-cover').value = '';
            document.getElementById('book-form-title').textContent = 'አዲስ መጽሐፍ መዝግብ';
            document.getElementById('book-save-btn').textContent = 'መጽሐፉን መዝግብ';
        }

        async function deleteBook(id) {
            if (!confirm('ይህን መጽሐፍ መሰረዝ ይፈልጋሉ?')) return;
            try {
                await supabaseClient.from('books').delete().eq('id', id);
                fetchBooks();
                alert('መጽሐፉ ተሰርዟል');
            } catch (e) {
                alert('መሰረዝ አልተቻለም');
            }
        }

        function renderAdminBooksList() {
            const list = document.getElementById('admin-books-list');
            if (!list) return;
            list.innerHTML = booksList.map(b => `
                <div class="flex items-center justify-between p-2 bg-slate-50 rounded-xl border text-xs">
                    <span class="font-bold truncate max-w-[200px]">${b.title} (${b.price} ብር)</span>
                    <div class="flex gap-2">
                        <button onclick="editBook('${b.id}', '${b.title}', '${b.author}', ${b.price}, '${b.category}', '${b.cover_image_url || ''}')" class="text-indigo-600 font-bold px-2">አስተካክል</button>
                        <button onclick="deleteBook('${b.id}')" class="text-rose-500 font-bold px-2">ሰርዝ</button>
                    </div>
                </div>
            `).join('');
        }

        // Background Manager
        function addBgImage() {
            const url = document.getElementById('new-bg-url').value.trim();
            if (!url) return;
            backgroundImages.push(url);
            localStorage.setItem('yichalal_hero_bgs', JSON.stringify(backgroundImages));
            document.getElementById('new-bg-url').value = '';
            initSlideshow();
            renderBgList();
        }

        function removeBgImage(idx) {
            backgroundImages.splice(idx, 1);
            localStorage.setItem('yichalal_hero_bgs', JSON.stringify(backgroundImages));
            initSlideshow();
            renderBgList();
        }

        function renderBgList() {
            const list = document.getElementById('admin-bg-list');
            if (!list) return;
            list.innerHTML = backgroundImages.map((url, i) => `
                <div class="flex justify-between items-center p-2 bg-slate-50 rounded-xl border text-xs">
                    <span class="truncate max-w-[250px]">${url}</span>
                    <button onclick="removeBgImage(${i})" class="text-rose-500 font-bold">ሰርዝ</button>
                </div>
            `).join('');
        }

        // Announcement Bar
        function updateAnnouncement() {
            const text = document.getElementById('announcement-input').value.trim();
            localStorage.setItem('yichalal_announcement', text);
            document.getElementById('announcement-bar').textContent = text;
            alert('ማስታወቂያው ተዘምኗል!');
        }

        function loadAnnouncement() {
            const saved = localStorage.getItem('yichalal_announcement');
            if (saved) {
                document.getElementById('announcement-bar').textContent = saved;
                document.getElementById('announcement-input').value = saved;
            }
        }

        // Cart & Checkout
        function toggleCartDrawer() {
            document.getElementById('cart-drawer').classList.toggle('translate-x-full');
            document.getElementById('cart-drawer-overlay').classList.toggle('hidden');
        }

        function addToCart(id) {
            const book = booksList.find(b => b.id === id);
            if (!book) return;
            const exist = cart.find(i => i.id === id);
            if (exist) exist.quantity += 1;
            else cart.push({ ...book, quantity: 1 });
            updateCartUI();
            toggleCartDrawer();
        }

        function updateCartUI() {
            const container = document.getElementById('cart-items-container');
            const countEl = document.getElementById('cart-count');
            const totalEl = document.getElementById('cart-total-amount');

            countEl.textContent = cart.reduce((s, i) => s + i.quantity, 0);
            if (cart.length === 0) {
                container.innerHTML = '<p class="text-slate-400 text-sm py-12 text-center">ቅርጫቱ ባዶ ነው።</p>';
                totalEl.textContent = '0.00 ብር';
                return;
            }

            let total = 0;
            container.innerHTML = cart.map(item => {
                total += item.price * item.quantity;
                return `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border text-xs">
                        <div class="flex items-center gap-3">
                            <img src="${item.cover_image_url || ''}" class="w-10 h-12 object-cover rounded">
                            <div>
                                <h4 class="font-bold text-slate-800">${item.title}</h4>
                                <p>${item.price} ብር × ${item.quantity}</p>
                            </div>
                        </div>
                        <button onclick="cart = cart.filter(i => i.id !== '${item.id}'); updateCartUI();" class="text-rose-500 font-bold">✕</button>
                    </div>
                `;
            }).join('');
            totalEl.textContent = total.toFixed(2) + ' ብር';
        }

        async function executeChapaCheckout() {
            if (cart.length === 0) return alert('እባክዎ መጽሐፍ ይምረጡ');
            const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
            const email = prompt("ኢሜይልዎን ያስገቡ:", "user@gmail.com");
            if (!email) return;

            try {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://api.chapa.co/v1/hosted/pay';
                const fields = {
                    public_key: 'CHAPA_TEST_PUB_lySnQ7s0rqESvfkJyNtF-iHtrlK0A0RrkWaQKN7I',
                    amount: total,
                    currency: 'ETB',
                    email: email,
                    first_name: currentUser ? currentUser.name || currentUser.username : 'እንግዳ',
                    last_name: 'አንባቢ',
                    tx_ref: 'tx-' + Math.random().toString(36).substring(2, 10),
                    return_url: window.location.href
                };
                for (const k in fields) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = k;
                    input.value = fields[k];
                    form.appendChild(input);
                }
                document.body.appendChild(form);
                form.submit();
            } catch (e) {
                alert('የክፍያ ስህተት: ' + e.message);
            }
        }

        function handleSearch(term) {
            const q = term.toLowerCase().trim();
            renderBooks(booksList.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)));
        }

        function filterCategory(cat) {
            document.querySelectorAll('.cat-btn').forEach(b => b.className = 'cat-btn bg-white hover:bg-slate-100 text-slate-700 border text-xs font-semibold px-4 py-2 rounded-xl transition');
            event.target.className = 'cat-btn active bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition';
            if (cat === 'all') renderBooks(booksList);
            else renderBooks(booksList.filter(b => b.category === cat));
        }

        function scrollToBooks() { document.getElementById('books-section').scrollIntoView({ behavior: 'smooth' }); }
    </script>
