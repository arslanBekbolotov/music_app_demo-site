import express from "express";
import { imagesUpload } from "../multer";
import { Album } from "../models/Album";
import { Error } from "mongoose";
import { Track } from "../models/Track";

const albumsRouter = express.Router();

albumsRouter.post("/", imagesUpload.single("image"), async (req, res, next) => {
  const albumData = {
    name: req.body.name,
    artist: req.body.artist,
    release: req.body.release,
    image: req.file ? req.file.filename : null,
  };

  const album = new Album(albumData);

  try {
    await album.save();
    return res.send(album);
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

albumsRouter.get("/", async (req, res) => {
  const { artist } = req.query;

  try {
    if (artist) {
      const albums = await Album.find({ artist })
        .populate("artist")
        .sort({ release: -1 });
      const result = await Promise.all(
        albums.map(async (item) => {
          const count = await Track.find({ album: item._id }).count();
          return {
            _id: item._id,
            name: item.name,
            image: item.image,
            release: item.release,
            count,
          };
        }),
      );

      return res.send({ albums: result, artist: albums[0].artist });
    }

    const albums = await Album.find().sort({ release: -1 });

    return res.send(albums);
  } catch (e) {
    return res.status(500).send(e);
  }
});

albumsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const albums = await Album.findOne({ _id: id }).populate("artist");
    return res.send(albums);
  } catch (e) {
    return res.status(500).send(e);
  }
});

export default albumsRouter;
