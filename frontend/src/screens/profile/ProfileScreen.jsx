import React, { useEffect, useState } from "react";
import { Form, Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaHeart } from "react-icons/fa";
import { IoIosFolderOpen } from "react-icons/io";
import { toast } from "react-toastify";
import { Button, Loader } from "../../components";
import {
  useProfileMutation,
  useUploadUserImageMutation,
} from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import FavScreen from "./FavScreen";
import Collections from "./Collections";
import "./ProfileScreen.css";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState();
  const [isActive, setIsActive] = useState("profile");
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState("100vh");

  const { userInfoMediquest } = useSelector((state) => state.auth);

  const [uploadUserImage, { isLoading: loadingUpload }] =
    useUploadUserImageMutation();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);
  useEffect(() => {
    if (width < 768) {
      setHeight("20vh");
    } else {
      setHeight("100vh");
    }
    setName(userInfoMediquest.name);
    setEmail(userInfoMediquest.email);
    setImage(userInfoMediquest.image);
  }, [
    userInfoMediquest.email,
    userInfoMediquest.name,
    userInfoMediquest.image,
    width,
  ]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadUserImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err?.data?.error);
    }
  };
  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
          image,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='profile-row pt-5'>
        <Col
          className='profile-sidebar p-3'
          md={2}
          style={{ height: `${height}` }}
        >
          <div className='mx-auto mb-20 max-md:hidden'>
            <Image
              src={image}
              style={{
                width: "150px",
                height: "150px",
                borderRadius:
                  userInfoMediquest.image === "/images/user_image.png"
                    ? "0"
                    : "50%",
                marginBottom: "3rem",
              }}
            />
            <h1 className='text-center text-2xl font-semibold'>{name}</h1>
          </div>
          <Link
            to='/profile/userinfo'
            className='profile-sidebar-item flex items-center gap-2'
            onClick={() => setIsActive("profile")}
          >
            <FaUser size={25} /> User Informations
          </Link>
          <Link
            to='/profile/favourites'
            className='profile-sidebar-item flex items-center gap-2'
            onClick={() => setIsActive("favourites")}
          >
            <FaHeart size={25} /> Liked
          </Link>
          <Link
            to='/profile/collections'
            className='profile-sidebar-item flex items-center gap-2'
            onClick={() => setIsActive("collections")}
          >
            <IoIosFolderOpen size={25} /> Collections
          </Link>
        </Col>

        <Col
          className='content-side '
          style={{ backgroundColor: "#161616", minHeight: "100vh" }}
          md={10}
        >
          {isActive === "profile" ? (
            <Row className='m-5 flex h-[80vh] items-center'>
              <Col>
                <div className='profile-image'>
                  {/*<FaCircleUser size={150} />*/}
                  <Image
                    src={image}
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius:
                        userInfoMediquest.image === "/images/user_image.png"
                          ? "0"
                          : "50%",
                      marginBottom: "2rem",
                    }}
                  />
                  <Form.Control
                    label='Choose File'
                    className='file:font-semibold file:text-black'
                    onChange={uploadFileHandler}
                    type='file'
                    style={{ width: "15rem" }}
                  ></Form.Control>
                </div>
              </Col>
              <Col className=''>
                {" "}
                <Form onSubmit={submitHandler}>
                  <Form.Group className='my-4' controlId='name'>
                    <Form.Label className='text-lg font-semibold'>
                      Name
                    </Form.Label>
                    <Form.Control
                      className='w-full rounded-md border-2 bg-[#161616] px-3 py-2 text-white focus-within:border-primary-green focus-within:bg-[#161616] focus-within:outline-none'
                      type='text'
                      placeholder='Enter name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group className='my-4' controlId='email'>
                    <Form.Label className='text-lg font-semibold'>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      className='w-full rounded-md border-2 bg-[#161616] px-3 py-2 text-white focus-within:border-primary-green focus-within:bg-[#161616] focus-within:outline-none disabled:bg-[#313131] disabled:text-gray-600'
                      type='email'
                      placeholder='Enter email'
                      value={email}
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group className='my-4' controlId='password'>
                    <Form.Label className='text-lg font-semibold'>
                      Password
                    </Form.Label>
                    <Form.Control
                      className='w-full rounded-md border-2 bg-[#161616] px-3 py-2 text-white focus-within:border-primary-green focus-within:bg-[#161616] focus-within:outline-none'
                      type='password'
                      placeholder='Enter password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group className='my-4' controlId='confirmPassword'>
                    <Form.Label className='text-lg font-semibold'>
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      className='w-full rounded-md border-2 bg-[#161616] px-3 py-2 text-white focus-within:border-primary-green focus-within:bg-[#161616] focus-within:outline-none'
                      type='password'
                      placeholder='Confirm password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button type='submit' text='Update' />
                  {loadingUpload && <Loader />}
                  {loadingUpdateProfile && <Loader />}
                </Form>
              </Col>
            </Row>
          ) : isActive === "favourites" ? (
            <Row className=''>
              {" "}
              <FavScreen />{" "}
            </Row>
          ) : (
            <Row className=''>
              {" "}
              <Collections />
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
