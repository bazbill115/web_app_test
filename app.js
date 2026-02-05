const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeWDiiOfmD1QadRkJ8vsdwuV0FhKK12fCuS-Y90KTfnFWG05g/formResponse';

// Check if we are on the index page
const form = document.getElementById('weekendForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('span');
        const loader = document.getElementById('submitLoader');

        // UI Feedback
        btnText.textContent = 'Sending...';
        loader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(form);

        // Google Forms typically doesn't support CORS for direct fetch calls that return status 200 properly to client JS.
        // However, we can use 'no-cors' mode to send the data. We won't know if it truly succeeded 
        // (status will be 0/opaque), but for this simple app, we assume success if no network error occurs.

        try {
            await fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Redirect to success page
            window.location.href = 'success.html';
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again.');

            // Reset UI
            btnText.textContent = 'Submit Response';
            loader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Check if we are on the success page
const catImageContainer = document.getElementById('catImage');
if (catImageContainer) {
    // Fetch Cat Image
    const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';

    async function fetchCat() {
        try {
            const response = await fetch(CAT_API_URL);
            const data = await response.json();

            if (data && data.length > 0) {
                const imageUrl = data[0].url;
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = "A random cute cat";
                img.onload = () => {
                    catImageContainer.innerHTML = '';
                    catImageContainer.appendChild(img);
                };
            }
        } catch (error) {
            console.error('Error fetching cat:', error);
            catImageContainer.innerHTML = '<p style="padding: 20px; color: var(--text-secondary)">Could not load cat :(</p>';
        }
    }

    fetchCat();
}
