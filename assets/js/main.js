/**
 * SafeHaul Landing Page - Main Script
 * Handles styling changes, FAQ accordions, Contact Modal logic.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================= */
    /* NAVBAR / MOBILE MENU                      */
    /* ========================================= */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    // Sticky Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    /* ========================================= */
    /* FAQ ACCORDION                             */
    /* ========================================= */
    const faqRows = document.querySelectorAll('.faq-row');

    faqRows.forEach(row => {
        const question = row.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others (optional)
            faqRows.forEach(r => {
                if (r !== row) {
                    r.classList.remove('active');
                    r.querySelector('.indicator').textContent = '+';
                }
            });

            // Toggle current
            const isActive = row.classList.contains('active');
            if (isActive) {
                row.classList.remove('active');
                question.querySelector('.indicator').textContent = '+';
            } else {
                row.classList.add('active');
                question.querySelector('.indicator').textContent = '-';
            }
        });
    });

    /* ========================================= */
    /* MODAL LOGIC                               */
    /* ========================================= */
    const modalButtons = document.querySelectorAll('.js-open-lead-modal');
    const modalOverlay = document.getElementById('leadModal');
    const closeModalBtn = document.getElementById('closeModal');
    const closeSuccessBtn = document.getElementById('successClose');
    const leadForm = document.getElementById('leadForm');
    const successMessage = document.getElementById('successMessage');

    // Open Modal
    modalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.classList.add('active');
            // Reset form states if previously shown
            leadForm.style.display = 'block';
            successMessage.style.display = 'none';
        });
    });

    // Close Modal Func
    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Handle Form Submit
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = leadForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(leadForm);
            const data = Object.fromEntries(formData.entries());

            // TELEGRAM CONFIGURATION
            const TELEGRAM_BOT_TOKEN = '8267965705:AAE8P-eeepGGA6q2ykvJkKv2Uo5I23eT3_I';
            const TELEGRAM_CHAT_ID = '2117922421';

            const message = `
🌟 *New Lead from Landing Page*

*👤 Name:* ${data.fullName}
*📧 Email:* ${data.workEmail}
*🏢 Company:* ${data.companyName}
*👥 Size:* ${data.companySize}
*📞 Phone:* ${data.phone || 'Not provided'}
*🎯 Goal:* ${data.primaryGoal}

*📅 Submitted:* ${new Date().toLocaleString()}
`.trim();

            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    }),
                });

                if (!response.ok) throw new Error('Failed to send.');

                // Show success view
                leadForm.style.display = 'none';
                successMessage.style.display = 'block';

                // Reset form button
                btn.textContent = originalText;
                btn.disabled = false;
                leadForm.reset();

            } catch (error) {
                console.error('Submission error:', error);
                alert('Failed to send request. Please check your internet connection or try again later.');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
});
