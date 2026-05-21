const deleteTask = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );

    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};