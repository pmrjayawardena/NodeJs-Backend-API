const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    if (req.params.bootcampId) {
      const courses = await Course.find({ bootcamp: req.params.bootcampId });

      return res.status(200).json({ success: true, data: courses });
    } else {
      res.status(200).json(res.advancedResults);
    }
  } catch (error) {
    // res.status(400).json({ success: false })
    next(error);
  }
};

// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await (await Course.findById(req.params.id)).populate({
      path: 'bootcamp',
      select: 'name description'
    });

    if (!course) {
      return next(
        new ErrorResponse(`no course with the id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    // res.status(400).json({ success: false })
    next(error);
  }
};
// @desc    add a course
// @route   POST /api/v1/bootcamp/:bootcampId/courses
// @access  Private
exports.addCourse = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No Bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add a course to bootcamp`,
          401
        )
      );
    }

    const course = await Course.create(req.body);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    // res.status(400).json({ success: false })
    next(error);
  }
};
// @desc    update course
// @route   PUT /api/vi/courses/:id
// @access  Private
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No Course with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update course`,
          401
        )
      );
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    // res.status(400).json({ success: false })
    next(error);
  }
};
// @desc    delete course
// @route   DELETE /api/vi/courses/:id
// @access  Private
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No Course with the id of ${req.params.id}`, 404)
      );
    }
    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete course`,
          401
        )
      );
    }
    await course.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    // res.status(400).json({ success: false })
    next(error);
  }
};
