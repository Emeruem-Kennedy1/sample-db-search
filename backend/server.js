const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.static("public"));
app.use(express.json());


app.get("/api/search", async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const [artists, totalCount] = await prisma.$transaction([
      prisma.artist.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        take: limitNumber,
        skip: offset,
        orderBy: {
          name: "asc", // You can change this to sort as needed
        },
      }),
      prisma.artist.count({
        where: {
          name: {
            contains: query,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.json({
      artists,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalCount,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error searching artists:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching artists" });
  }
});

const PORT = process.env.PORT || 9696;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
