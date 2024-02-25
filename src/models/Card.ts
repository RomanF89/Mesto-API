import mongoose, { ObjectId } from 'mongoose';
import urlRegex from '../validation/regex';

interface Card {
  name: string,
  link: string,
  owner: ObjectId,
  likes: ObjectId[],
  createdAt: Date,
}

const cardSchema = new mongoose.Schema<Card>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return urlRegex.test(v);
      },
      message: (props) => `${props.value} URL is not correct!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

export default mongoose.model<Card>('card', cardSchema);
