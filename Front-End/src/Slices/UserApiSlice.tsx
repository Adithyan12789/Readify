import { apiSlice } from "./ApiSlice";
import {
  UserResponse,
  UserCredentials,
  RegisterCredentials,
  OtpCredentials,
} from "../Types/UserTypes";

const USERS_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, UserCredentials>({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation<UserResponse, RegisterCredentials>({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<UserResponse, OtpCredentials>({
      query: (data) => ({
        url: `${USERS_URL}/verifyotp`,
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    sendPasswordResetEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password/${data.token}`,
        method: "PUT",
        body: { password: data.password },
      }),
    }),

    refreshToken: builder.mutation<void, void>({
      query: () => {
        console.log(
          "Sending refresh token request to:",
          `${USERS_URL}/refresh-token`
        );
        return {
          url: `${USERS_URL}/refresh-token`,
          method: "POST",
        };
      },
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    getMovies: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/get-movies`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetUserProfileQuery,
  useUpdateUserMutation,
  useGetMoviesMutation,
} = usersApiSlice;
