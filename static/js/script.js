document.getElementById('submit-btn').addEventListener('click', function() {
    var fileInput = document.getElementById('csv-file');
    var file = fileInput.files[0];

    if (!file) {
        alert('Please upload a CSV file.');
        return;
    }

    var formData = new FormData();
    formData.append('csv-file', file);

    fetch('/grade', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        var resultDiv = document.getElementById('grades-result');
        if (data.error) {
            resultDiv.innerHTML = '<p class="error">' + data.error + '</p>';
        } else {
            resultDiv.innerHTML = '<p>File processed successfully. <a href="/download">Download the result CSV</a>.</p>';
        }
    });
});
