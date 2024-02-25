import mongoose from 'mongoose';
import validation from 'validator';
import urlRegex from '../validation/regex';

interface User {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v: string) {
        return urlRegex.test(v);
      },
      message: (props) => `${props.value} URL is not correct!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v: string) {
        return validation.isEmail(v);
      },
      message: 'email is not correct!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
});

export default mongoose.model<User>('user', userSchema);
