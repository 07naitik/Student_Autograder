document.getElementById('submit-btn').addEventListener('click', function() {
    var marksInput = document.getElementById('marks').value;
    var marksArray = marksInput.split(',').map(Number);

    fetch('/grade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ marks: marksArray })
    })
    .then(response => response.json())
    .then(data => {
        var resultDiv = document.getElementById('grades-result');
        if (data.error) {
            resultDiv.innerHTML = '<p class="error">' + data.error + '</p>';
        } else {
            var gradesList = data.grades.map((grade, index) => '<li>Student ' + (index + 1) + ': ' + grade + '</li>').join('');
            resultDiv.innerHTML = '<ul>' + gradesList + '</ul>';
        }
    });
});
