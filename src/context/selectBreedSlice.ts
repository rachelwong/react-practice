// persisted in local storage
export interface SelectionState {
  selectedNames: string[]; // maximum 2
  maxImagesByBreed: Record<string, number>; // {'beagle': 5 or 10 default}
}
