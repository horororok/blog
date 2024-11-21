import { useEffect, useState } from "react";
import styled from "styled-components";

import { DevlifePostsSummary } from "../posts/Devlife/DevlifePostsSummary";
import { ProjectPostsSummary } from "../posts/Project/ProjectPostsSummary";
import { StudyPostsSummary } from "../posts/Study/StudyPostsSummary";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

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
`;

const PageDescription = styled.p`
  color: #666;
  margin-top: 0.5rem;
`;

const CategorySection = styled.section`
  margin-bottom: 3rem;
`;

const CategoryTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  span {
    font-size: 1rem;
    color: #666;
  }
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PostItem = styled.article`
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const PostTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;

  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;

const PostMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background: ${(props) => (props.theme === "light" ? "#edf2f7" : "#4a5568")};
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: ${(props) => (props.theme === "light" ? "#747474" : "#c7c7c7")};

  &:hover {
    background: #eee;
    color: #646cff;
    cursor: pointer;
  }
`;

const EtcPage = () => {
  const [categorizedPosts, setCategorizedPosts] = useState({});
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const allPosts = [
      ...DevlifePostsSummary,
      ...ProjectPostsSummary,
      ...StudyPostsSummary,
    ];

    const groupedPosts = allPosts.reduce((acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = [];
      }
      acc[post.category].push(post);
      return acc;
    }, {});

    // 카테고리 이름으로 정렬
    // const sortedGroupedPosts = Object.fromEntries(
    //   Object.entries(groupedPosts).sort(([categoryA], [categoryB]) =>
    //     categoryA.localeCompare(categoryB)
    //   )
    // );

    // 포스트 개수로 정렬
    const sortedGroupedPosts = Object.fromEntries(
      Object.entries(groupedPosts).sort(
        ([, postsA], [, postsB]) => postsB.length - postsA.length
      )
    );

    Object.keys(sortedGroupedPosts).forEach((category) => {
      sortedGroupedPosts[category].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    });

    setCategorizedPosts(sortedGroupedPosts);
  }, []);

  const handlePostClick = (section, id) => {
    navigate(`/${section}/${id}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Etc</PageTitle>
        <PageDescription>카테고리별 모든 포스트</PageDescription>
      </PageHeader>

      {Object.entries(categorizedPosts).map(([category, posts]) => (
        <CategorySection key={category}>
          <CategoryTitle>
            {category} <span>({posts.length})</span>
          </CategoryTitle>
          <PostsList>
            {posts.map((post) => (
              <PostItem key={`${post.section}-${post.id}`}>
                <PostTitle
                  onClick={() => handlePostClick(post.section, post.id)}
                >
                  {post.title}
                </PostTitle>
                <PostMeta>
                  <span>{post.date}</span>
                  {post.summary && <span>·</span>}
                  {post.summary && <span>{post.summary}</span>}
                </PostMeta>
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
        </CategorySection>
      ))}
    </PageContainer>
  );
};

export default EtcPage;
