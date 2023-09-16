import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAlbums } from "./albumsThunk";
import { useParams } from "react-router-dom";
import AlbumsItem from "./components/AlbumsItem";
import { Box, Skeleton, Typography } from "@mui/material";

const Albums = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams() as { id: string };
  const { albums, fetchLoading, artist } = useAppSelector(
    (state) => state.albumsStore,
  );

  useEffect(() => {
    dispatch(fetchAlbums(id));
  }, [dispatch, id]);

  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h3" component="h2" sx={{ mb: "20px" }}>
          {artist && artist.name}
        </Typography>
      </Box>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "30px",
          cursor: "pointer",
        }}
      >
        {fetchLoading
          ? Array.from(new Array(12)).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={265}
                height={260}
              />
            ))
          : albums.map((album) => <AlbumsItem key={album._id} album={album} />)}
      </div>
    </div>
  );
};

export default Albums;
