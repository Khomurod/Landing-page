/**
 * SafeHaul Lead Generation Form Logic
 * Handles modal visibility and form submission to Firebase Functions
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('leadModal');
    const leadForm = document.getElementById('leadForm');
    const successMessage = document.getElementById('successMessage');
    const closeModalBtn = document.getElementById('closeModal');
    const successCloseBtn = document.getElementById('successClose');
    const formStatus = document.getElementById('formStatus');
    const openModalBtns = document.querySelectorAll('.js-open-lead-modal');

    // CONFIGURATION (Direct Telegram Call)
    // NOTE: Storing the token in JS makes it visible to source code viewers.
    const TELEGRAM_BOT_TOKEN = '8267965705:AAE8P-eeepGGA6q2ykvJkKv2Uo5I23eT3_I';
    const TELEGRAM_CHAT_ID = '2117922421';

    // --- MODAL CONTROL ---

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling

        // Reset form state after animation
        setTimeout(() => {
            leadForm.style.display = 'grid';
            successMessage.style.display = 'none';
            leadForm.reset();

            // RESET BUTTON STATE
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request Access';
            }

            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 300);
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- DEEP LINKING ---
    const checkHash = () => {
        if (window.location.hash === '#get-started') {
            openModal();
        }
    };

    // Check on load
    checkHash();

    // Check on hash change (if user is already on the page)
    window.addEventListener('hashchange', checkHash);

    // --- FORM SUBMISSION ---

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Initial State
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.textContent = 'Processing your request...';
        formStatus.className = 'form-status loading';

        // 2. Collect Data
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData.entries());

        // 3. Format Message for Telegram
        const message = `
🚀 *New Lead from Landing Page*

*👤 Name:* ${data.fullName}
*📧 Email:* ${data.workEmail}
*🏢 Company:* ${data.companyName}
*👥 Size:* ${data.companySize}
*📞 Phone:* ${data.phone || 'Not provided'}
*🎯 Goal:* ${data.primaryGoal}

*📅 Submitted:* ${new Date().toLocaleString()}
        `.trim();

        try {
            // 4. Send Directly to Telegram API
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.description || 'Failed to send. Please check your internet.');
            }

            // 5. Handle Success
            leadForm.style.display = 'none';
            successMessage.style.display = 'block';
            console.log('Notification sent successfully!');

        } catch (error) {
            // 6. Handle Error
            console.error('Submission error:', error);

            if (error.message.includes('chat not found')) {
                showError('⚠️ <b>Bot not started!</b><br>Please open <a href="https://t.me/safehaultech_bot" target="_blank" style="color: #fff; text-decoration: underline;">@safehaultech_bot</a> in Telegram and click <b>START</b>, then try again.');
            } else {
                showError(error.message || 'Something went wrong. Please try again.');
            }

            formStatus.className = 'form-status error';
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});
