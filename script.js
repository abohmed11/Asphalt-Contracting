/* ==========================================================================
   ملف البرمجة والربط الكامل والمصلح بـ Supabase بدون أي تصادم في الأسماء
   ========================================================================== */
const SUPABASE_URL = 'https://akchwqsclhxctfzfqdos.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY2h3cXNjbGh4Y3RmemZxZG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTUyMTUsImV4cCI6MjA5NTU3MTIxNX0.f3Fi_lztbkbg5rgv8zrgRsxAy1Y3jt7NgBEc_eJKXlk';

// استخدام اسم db لمنع خطأ الـ Identifier 'supabase' has already been declared
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    console.log("الموقع جاهز والربط سليم!");

    // عناصر الصفحة الأساسية
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    const quoteForm = document.getElementById('quoteForm');

    // 1. تغيير خلفية شريط التنقل عند التمرير لأسفل (Sticky Navigation)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // 2. التحكم في قائمة الجوال (القائمة الجانبية في الشاشات الصغيرة)
    hamburger?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    // إغلاق القائمة تلقائياً عند الضغط على أي لينك
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            const icon = hamburger?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });

    /* ==========================================================================
       3. معالجة الإرسال الفعلي للفورم وحفظ البيانات المباشر في جدول quotes
       ========================================================================== */
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            // منع الصفحة من إعادة التحميل التلقائي
            e.preventDefault();
            
            // جلب مدخلات المستخدم من الفورم
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // قفل زر الإرسال مؤقتاً أثناء الرفع
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'جاري إرسال طلبك...';
            submitBtn.disabled = true;

            try {
                // إدراج البيانات داخل جدول 'quotes' في Supabase
                const { data, error } = await db
                  .from('quotes')
                  .insert([
                    { name: name, phone: phone, service_type: service, message: message }
                  ]);

                if (error) throw error;

                // رسالة نجاح في حال الإرسال السليم
                alert(`شكراً لك يا ${name}! تم تسجيل طلبك بنجاح، وسنتصل بك على الرقم ${phone} في أقرب وقت.`);
                quoteForm.reset();

            } catch (err) {
                console.error('خطأ Supabase:', err);
                alert('حدثت مشكلة أثناء إرسال البيانات:\n' + (err.message || JSON.stringify(err)));
            } finally {
                // إعادة الزر لوضعه الطبيعي
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});





















// 1. منع القائمة المنسدلة عند الضغط كليك يمين
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 2. منع اختصارات لوحة المفاتيح الخاصة بالفحص وسرقة الكود
document.addEventListener('keydown', function(e) {
    // منع F12 (فتح أدوات المطور)
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // منع Ctrl + Shift + I (فتح الفحص)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // منع Ctrl + Shift + J (فتح الكونسول)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    
    // منع Ctrl + U (عرض سورس كود الصفحة View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // منع Ctrl + S (حفظ الصفحة على الجهاز)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
    }
});
