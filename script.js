function calculateTimeDifference(timeRanges) {
    const timeRangesArray = timeRanges.split('+');


    let totalDifferenceMs = 0;
    for (const timeRange of timeRangesArray) {
        const trimmedTimeRange = timeRange.trim();

        const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)-([0-1]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(trimmedTimeRange)) {
            return {
                error: `Неверный формат времени в диапазоне: ${trimmedTimeRange}`
            };
        }

        const [start, end] = trimmedTimeRange.split('-');
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        const startDate = new Date();
        startDate.setHours(startHours, startMinutes, 0, 0);
        const endDate = new Date();
        endDate.setHours(endHours, endMinutes, 0, 0);

        let differenceMs = endDate - startDate;
        if (differenceMs < 0) {
            differenceMs += 24 * 60 * 60 * 1000;
        }
        totalDifferenceMs += differenceMs;
    }

    const totalDifferenceHours = parseFloat((totalDifferenceMs / (60 * 60 * 1000)).toFixed(2));
    return totalDifferenceHours;
}

const timeRangesInput = document.getElementById('timeInput');
const resultOutput = document.getElementById('timeResult');

timeRangesInput.addEventListener('input', () => {
    const timeRanges = timeRangesInput.value;
    updateResult(timeRanges);
});

timeRangesInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

function updateResult(timeRanges) {
    resultOutput.innerHTML = '';

    if (timeRanges.trim() === "") {
        return;
    }

    const result = calculateTimeDifference(timeRanges);

    if (typeof result === 'object' && result.error) {
        const errorElement = document.createElement('span');
        errorElement.classList.add('error');
        errorElement.textContent = result.error;
        resultOutput.appendChild(errorElement);
    } else {
        const resultSpan = document.createElement('span');
        resultSpan.textContent = result;
        resultSpan.addEventListener('click', () => {
            navigator.clipboard.writeText(result.toString());
            resultSpan.textContent = result + " ✅";
            setTimeout(() => {
                resultSpan.textContent = result;
            }, 2000);
        });
        resultOutput.appendChild(resultSpan);
    }
}

// Примеры использования
// 09:05-11:26 // 2.35
// 14:21-21:30+08:00-12:00 // 15.15