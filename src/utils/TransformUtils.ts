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
