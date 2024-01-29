import express from "express";
import cors from "cors";
import { Prisma, PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async function (req, res) {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/api/notes", async function (req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops something went wrong");
  }
});

app.put("/api/notes/:id", async function (req, res) {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, Something went wrong");
  }
});

app.delete("/api/notes/:id", async function(req, res) {
  const id = parseInt(req.params.id);

  if(!id || isNaN(id)) {
    return res.status(400).send("ID must be a vallid integer")
  }

  try {
    await prisma.note.delete({
      where: {id}
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, Something went wrong!")
  }
})

app.listen(3000, '0.0.0.0', () => {
  console.log("Server is running on 3000");
});
