const useDragAndDrop = () => {};

export default useDragAndDrop;

// The reducer only runs if something dispatches an action. If a user drags a game item over the start zone and lets go, the browser decides what happens, not your reducer. You stop it in the drag-and-drop layer (your empty useDragAndDrop):

// Tag each drag with where it started. For example, e.dataTransfer.setData("source", "game") or "start" in onDragStart. A ref holding { source, index } also works.
// Have the start zone refuse game items. In the start zone's onDragOver, only call e.preventDefault() when the source is "start". If you don't call preventDefault, the browser won't treat that spot as a valid drop target: the cursor shows "not allowed" and the item snaps back. Nothing is dispatched.
// Have the game zone pick the action by source:
// from "start": dispatch MOVE_START_ITEM
// from "game": dispatch MOVE_GAME_ITEM
// So the reducer keeps the data correct, and the drop handling keeps the experience correct. You need both.
