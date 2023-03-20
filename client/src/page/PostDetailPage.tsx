import { useParams } from 'react-router-dom';
import PostDetail from '../container/postdetail/PostDetail';
import styled from 'styled-components';
import CountsBar from '../components/CountsBar';
import Answer from '../container/postdetail/Answer';
import SubAnswer from '../container/postdetail/SubAnswer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import getCookie from '../utils/cookieUtils';

type Post = {
  content: string;
  createdAt: Date;
  nickname: string;
  tag: string;
  title: string;
  answers: any;
};

const PostDetailPage = () => {
  const { questionId } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  const postData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/questions/${questionId}`);
      const { data } = response.data;
      console.log(data.answers);
      setPost(data); // 서버에서 발급한 토큰 등의 정보가 담긴 객체
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    postData();
  }, []);

  return (
    <PostDetailWrapper>
      {post !== null && <PostDetail {...post} />}
      <CountsBar></CountsBar>
      <AnswerWrapper>
        <>
          {post?.answers.map((el: any) => {
            <Answer {...el} />;
          })}
        </>
        {/* <SubAnswer></SubAnswer> */}
      </AnswerWrapper>
    </PostDetailWrapper>
  );
};

export default PostDetailPage;

const PostDetailWrapper = styled.div`
  /* padding: 0 16px; */
`;

const AnswerWrapper = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
