export const getSafe = (p, o) => p.reduce((xs, x) => (xs && x in xs ? xs[x] : null), o);