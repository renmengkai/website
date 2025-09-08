import { useState } from "preact/hooks";

export default function FavoriteButton() {
  const [favorited, setFavorited] = useState(false);

  return (
    <button
      type="button"
      className={`btn fav ${favorited ? "btn-favorited" : "btn-primary"}`}
      onClick={() => setFavorited((f) => !f)}
    >
      {favorited ? "★ Favorited!" : "☆ Add to Favorites"}
    </button>
  );
}
