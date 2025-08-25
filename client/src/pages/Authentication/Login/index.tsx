import useUserAuth from '../../../hooks/useUserAuth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loginObjs } from './loginData';
import FieldInput from '../../../components/Inputs/FieldInput';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../../store';
import { useSelector } from 'react-redux';
import { handleLoginUser } from '../../../store/user/userAuthSlice';

type Inputs = {
  user: {
    email: string;
    password: string;
  };
};

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth);
  console.log('user - - - -', user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      user: {
        email: '',
        password: '',
      },
    },
    mode: 'onChange',
  });

  // const { loginUser, registerErr } = useUserAuth({ reset })

  // const onSubmit: SubmitHandler<Inputs> = (data) => loginUser.mutate(data)

  const onSubmit = (data: any) => {
    console.log('data', data);
    dispatch(
      handleLoginUser({
        data: data,
      }),
    );
    navigate('/dashboard');
  };
  const loginUser = {
    isLoading: false,
  };
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>

            <ul className="error-messages">
              {errors.user &&
                Object.keys(errors.user as Record<string, any>).map((key) => (
                  <li key={key}>
                    {(errors.user as Record<string, any>)[key].message}
                  </li>
                ))}
              {/* {loginUser.isError &&
                registerErr &&
                Object.keys(registerErr).map((errKey: string) =>
                  (registerErr[errKey] as string[]).map(
                    (errMsg: string, i: number) => (
                      <li key={`${errKey}-${i}`}>{`${errKey}: ${errMsg}`}</li>
                    ),
                  ),
                )} */}
            </ul>

            <form onSubmit={handleSubmit(onSubmit)}>
              {loginObjs.map((loginObj: any, c: number) => (
                <FieldInput
                  {...loginObj}
                  register={register}
                  isLoading={loginUser?.isLoading}
                  key={c}
                />
              ))}
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                disabled={loginUser.isLoading}
              >
                {loginUser.isLoading ? 'Loading...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
