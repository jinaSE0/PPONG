import { useParams } from 'react-router-dom';
import PostDetail from '../container/postdetail/PostDetail';
import styled from 'styled-components';
import CountsBar from '../container/postdetail/CountsBar';
import Answer from '../container/postdetail/Answer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { usePage } from '../hooks/usePage';
import CommentForm from '../container/postdetail/CommentForm';

type Post = {
  content: string;
  createdAt: Date;
  nickname: string;
  tag: string;
  title: string;
  answers: any;
  likeCount: number;
  questionId: number;
  questionImageUrl: string;
  profileImageUrl: string;
  questionStatus: string;
  memberId: number;
  likeCheck: boolean;
};

const PostDetailPage = () => {
  const { questionId } = useParams();
  const [isTextarea, setTextarea] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const { setPostDetailHandler } = usePage();

  const postData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/questions/${questionId}`);
      const { data } = response.data;
      console.log(data);
      setPost(data); // 서버에서 발급한 토큰 등의 정보가 담긴 객체
      setPostDetailHandler(data.memberId, data.questionId);
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
      {post?.questionImageUrl !== null && <PostDetailImg src={post?.questionImageUrl} alt="postImage" />}
      {post !== null && <CountsBar questionId={post.questionId} isTextarea={isTextarea} answerHandler={setTextarea} answer={post.answers.length} likeCount={post.likeCount} likeCheck={post.likeCheck} />}
      <AnswerWrapper>
        {post !== null && isTextarea && <CommentForm questionId={post.questionId} />}
        {post?.answers.length === 0 && <span>잔소리가 없습니다.</span>}
        {post?.answers.map((el: { likeCount: number; answerStatus: string; content: string; createdAt: string; nickname: string; comments: []; memberId: number; answerId: number; profileImageUrl: string }, index: number) => {
          return <Answer key={index} likeCheck={post.answers[index].likeCheck} postMemberId={post?.memberId} questionId={post?.questionId} {...el} />;
        })}
      </AnswerWrapper>
    </PostDetailWrapper>
  );
};

export default PostDetailPage;

const PostDetailWrapper = styled.div`
  /* padding: 0 16px; */
`;

const PostDetailImg = styled.img`
  width: 30%;
  height: 30%;
  padding: 16px;
`;
const AnswerWrapper = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 25px;
`;
