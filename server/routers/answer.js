const express = require("express");
const {
  updateAnswerById,
  deleteAnswer,
} = require("../services/answerServices");

const router = express.Router();

router.delete("/:examId", async (req, res) => {
  const { examId } = req.params;
  const data = await deleteAnswer(examId);
  res.json(data);
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing Answer ID in URL." });
    }

    const updatedAnswer = await updateAnswerById(id, req.body);

    if (!updatedAnswer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    res.json(updatedAnswer);
  } catch (error) {
    console.error("Update Answer error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
