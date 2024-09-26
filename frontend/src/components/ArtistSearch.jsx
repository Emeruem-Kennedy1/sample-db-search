import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { searchArtists } from "../store/artistSlice";
import styles from "./ArtistSearch.module.css"; // Adjust the import according to your project structure

const ArtistSearch = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { artists, pagination, status, error } = useSelector(
    (state) => state.artists
  );

  useEffect(() => {
    const debouncedSearch = debounce((searchQuery) => {
      if (searchQuery) {
        dispatch(searchArtists({ query: searchQuery }));
      }
    }, 300);

    debouncedSearch(query);

    return () => debouncedSearch.cancel();
  }, [query, dispatch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleLoadMore = useCallback(() => {
    if (pagination && pagination.hasNextPage) {
      dispatch(searchArtists({ query, page: pagination.currentPage + 1 }));
    }
  }, [dispatch, pagination, query]);

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search artists..."
        className={styles.searchInput}
      />

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && (
        <p className={styles.errorMessage}>Error: {error}</p>
      )}

      {status === "succeeded" && (
        <div>
          <ul className={styles.artistList}>
            {artists.map((artist) => (
              <li key={artist.id} className={styles.artistItem}>
                {artist.name}
              </li>
            ))}
          </ul>
          {pagination && pagination.hasNextPage && (
            <button onClick={handleLoadMore} className={styles.loadMoreButton}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistSearch;
