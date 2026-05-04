const scrollPanels = document.getElementById("scroll-panels");
const panels = document.querySelectorAll(".scroll-panel");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const year = +entry.target.dataset.year;
            document.getElementById("yearSlider").value = year;
            document.getElementById("yearLabel").textContent = year;
            if (window.updateYear) window.updateYear(year);
        }
    });
}, {
    root: scrollPanels,
    threshold: 0.5
});

panels.forEach(panel => observer.observe(panel));