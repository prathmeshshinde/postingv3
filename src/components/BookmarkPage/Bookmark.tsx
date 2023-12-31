import { Divider, Empty, Layout, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Header from "../HomePage/Header";
import SinglePost from "../HomePage/SinglePost";
import { useUserAuth } from "../../context/AuthContext";
import { getBookmarkPosts } from "./getBookmarkPosts";
import {
  IBookmarkPosts,
  IDeleteLikedPosts,
  ILikedPosts,
  IRemoveBookmarkPosts,
} from "../../Interface/ILikedAndBookmarkPosts";
import { IPost } from "../../Interface/IPost";
const { Content } = Layout;

interface IProps {
  likedPosts: ILikedPosts[];
  deleteLikePost: IDeleteLikedPosts[];
  bookmarkPost: IBookmarkPosts[];
  removeBookmarkPosts: IRemoveBookmarkPosts[];
  likedPostsId: string[];
  bookmarkedPostId: string[];
}

const Bookmark: React.FC<IProps> = ({
  likedPosts,
  deleteLikePost,
  bookmarkPost,
  removeBookmarkPosts,
  bookmarkedPostId,
  likedPostsId,
}) => {
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const { currUser }: any = useUserAuth();
  const localStore = localStorage.getItem("userId");

  const handleRemoveBookmarkPosts = (id: string) => {
    setUserPost((prevState) =>
      prevState.filter((post: IPost) => post.postId !== id)
    );
  };

  useEffect(() => {
    getBookmarkPosts(bookmarkPost, setError, setLoading, setUserPost);
  }, [currUser]);

  return (
    <Layout className="margin-top">
      <Layout className="site-layout scroll-app">
        <Header />

        <Divider
          style={{
            fontSize: "22px",
            color: "#3087ff",
            fontWeight: "700",
          }}
        >
          Bookmarks
        </Divider>
        {error ? (
          <p className="no-comments-text">Error Please try Again!</p>
        ) : null}

        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {loading ? (
            <div className="loading-spin">
              <Spin tip="Loading" size="large">
                <div className="content" />
              </Spin>
            </div>
          ) : (
            <div>
              {userPost?.length === 0 ? (
                <div style={{ marginTop: "100px" }}>
                  <Empty />
                </div>
              ) : (
                <div>
                  {userPost.map((newPost: any, index: any) => {
                    return (
                      <SinglePost
                        key={index}
                        postItem={newPost}
                        likedPosts={likedPosts}
                        deleteLikePost={deleteLikePost}
                        bookmarkPost={bookmarkPost}
                        removeBookmarkPosts={removeBookmarkPosts}
                        handleRemoveBookmarkPosts={handleRemoveBookmarkPosts}
                        bookmarkedPostId={bookmarkedPostId}
                        likedPostsId={likedPostsId}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!localStore ? (
            <p className="no-comments-text">
              Please login to see bookmarked posts
            </p>
          ) : null}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Bookmark;
