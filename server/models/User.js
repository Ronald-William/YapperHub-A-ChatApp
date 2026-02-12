import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,

    username: {
      type: String,
      unique: true,
      required: true
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
