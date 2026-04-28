class StudentService {
  constructor(Student) {
    this.Student = Student;
  }

  create(data) {
    return this.Student.create(data);
  }

  getAll(query) {
    const { page = 1, limit = 10, major } = query;
    const filter = { isActive: true };
    if (major) {
      filter.major = major; 
    }

    return this.Student.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
  }

  getById(id) {
    return this.Student.findOne({ _id: id, isActive: true });
  }

  update(id, data) {
    return this.Student.findOneAndUpdate(
      { _id: id, isActive: true }, 
      data, 
      { new: true }
    );
  }

  delete(id) {
    return this.Student.findOneAndUpdate(
      { _id: id, isActive: true }, 
      { isActive: false },
      { new: true }
    );
  }

  updateScore(id, score) {
    return this.Student.findOneAndUpdate(
      { _id: id, isActive: true }, 
      { score },
      { new: true }
    );
  }

  getTop(limit = 5) {
    return this.Student.find({ isActive: true }).sort("-score").limit(limit);
  }

  avgScore() {
    return this.Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: "$score" } } }
    ]);
  }

  searchByName(keyword) {
    return this.Student.find({
      isActive: true,
      name: { $regex: keyword, $options: "i" }
    });
  }
}

module.exports = StudentService;