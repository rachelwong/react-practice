// Knuth shuffle algorithm
export const randomShuffleArray = <T>({ items }: { items: T[] }) => {
  const shuffled = [...items]; // copy list

  // step through the array from the last item to the first
  for (let current = shuffled.length - 1; current > 0; current--) {
    // find item to swap with and it's anyone in the list up to the current item
    const swapPartner = Math.floor(Math.random() * (current + 1));

    // swap position of the current item and the random swap partner
    [shuffled[current], shuffled[swapPartner]] = [
      shuffled[swapPartner],
      shuffled[current],
    ];
  }
  return shuffled;
};

// Sattolo shuffle algorithm (every element ends up in a new position)
// different to Fisher-Yates in it picks current as the swap partner as well
// Sattolo does not allow picking current item as swap partner
// can't swap with itself
export const fullRandomShuffleArray = <T>({ items }: { items: T[] }) => {
  const shuffled = [...items];

  // eval from back of the array (from right to left)
  for (let curr = shuffled.length - 1; curr > 0; curr--) {
    // find random item BEFORE (to the left) of current item
    const swapPartner = Math.floor(Math.random() * curr);
    // swap places
    [shuffled[curr], shuffled[swapPartner]] = [
      shuffled[swapPartner],
      shuffled[curr],
    ];
  }

  return shuffled;
};
