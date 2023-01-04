const keys = [
    'C',
    'C♯/D♭',
    'D',
    'D♯/E♭',
    'E',
    'F',
    'F♯/G♭',
    'G',
    'G♯/A♭',
    'A',
    'A♯/B♭',
    'B'
]

export const getKeySignature = (key) => {
    if (key === -1) {
        return 'Unknown';
    } else {
        return keys[key];
    }
}

export const getModality = (mode) => {
    if (mode) {
        return 'Major';
    } else {
        return 'Minor';
    }
}

export const getTempo = tempo => {
    return tempo.toFixed(0).toString();
}

export const getTimeSignature = timeSig => {
    return `${timeSig.toString()}/4`;
}

export const getDuration = durationMs => {
    const mins = (durationMs/1000)/60;
    const secs = (durationMs/1000)%60;
    return `${Math.floor(mins).toString()}:${Math.floor(secs).toString()}`
}

export const getFeaturePercentage = (value) => {
    return `${(value.toFixed(2) * 100).toString()}%`;
}