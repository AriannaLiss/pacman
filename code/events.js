const DEF_BG = 'rgba(239, 141, 227, 0.935)';

export const switchTheme = (e) => {
    if (e.target.checked) {
        document.querySelector('.container').style.backgroundColor = e.target.id;
    }
}

export const resetColor = (e) => {
    if (e.target.checked) {
        document.querySelector('.container').style.backgroundColor = DEF_BG;
    }
}
