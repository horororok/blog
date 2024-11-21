import styled from "styled-components";

import { StudyPostsSummary } from "../posts/Study/StudyPostsSummary";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 4rem;
  padding-bottom: 1.5rem;
  border-bottom: 4px solid #646cff;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const PostItem = styled.article`
  padding-bottom: 4rem;
  border-bottom: 1px solid #eaeaea;

  &:last-child {
    border-bottom: none;
  }
`;

const PostTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
  transition: color 0.2s ease;

  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;

const PostDate = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const PostSummary = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.5rem;
`;

const Tag = styled.span`
  background: ${(props) => (props.theme === "light" ? "#edf2f7" : "#4a5568")};
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #4a5568;
    cursor: pointer;
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

const Category = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: #555;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
    color: #646cff;
  }
`;

const StudyPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = [...StudyPostsSummary];

    const sortedPosts = allPosts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    setPosts(sortedPosts);
  }, []);

  const handlePostClick = (id) => {
    navigate(`/study/${id}`);
  };
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Study</PageTitle>
        <PageDescription>개발 공부</PageDescription>
      </PageHeader>

      <PostsList>
        {posts.map((post) => (
          <PostItem key={post.id}>
            <Category>{post.category}</Category>
            <PostTitle onClick={() => handlePostClick(post.id)}>
              {post.title}
            </PostTitle>
            <PostDate>{post.date}</PostDate>
            <PostSummary>{post.summary}</PostSummary>
            <TagsContainer>
              {post.tags.map((tag, index) => (
                <Tag key={index} theme={theme}>
                  {tag}
                </Tag>
              ))}
            </TagsContainer>
          </PostItem>
        ))}
      </PostsList>
    </PageContainer>
  );
};

export default StudyPage;