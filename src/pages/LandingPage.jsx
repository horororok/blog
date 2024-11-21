import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

import { DevlifePostsSummary } from "../posts/Devlife/DevlifePostsSummary";
import { ProjectPostsSummary } from "../posts/Project/ProjectPostsSummary";
import { StudyPostsSummary } from "../posts/Study/StudyPostsSummary";
import { useEffect, useState } from "react";

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.section`
  text-align: center;
  padding: 6rem 1rem;
  background: ${(props) =>
    props.theme === "light"
      ? "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)"
      : "linear-gradient(135deg, #2d3436 0%, #1a1a1a 100%)"};
  border-radius: 20px;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: ${(props) => (props.theme === "light" ? "#2d3748" : "#f7fafc")};
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => (props.theme === "light" ? "#4a5568" : "#a0aec0")};
  max-width: 600px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeaturedPost = styled(Link)`
  background: ${(props) => (props.theme === "light" ? "#ffffff" : "#2d2d2d")};
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PostTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.theme === "light" ? "#1a202c" : "#f7fafc")};
`;

const PostMeta = styled.div`
  font-size: 0.875rem;
  color: ${(props) => (props.theme === "light" ? "#718096" : "#a0aec0")};
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${(props) => (props.theme === "light" ? "#edf2f7" : "#4a5568")};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  padding-left: 1rem;
  color: ${(props) => (props.theme === "light" ? "#2d3748" : "#f7fafc")};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled(Link)`
  background: ${(props) => (props.theme === "light" ? "#ffffff" : "#2d2d2d")};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: ${(props) => (props.theme === "light" ? "#ffffff" : "#2d2d2d")};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #646cff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const LandingPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const allPosts = [
      ...DevlifePostsSummary,
      ...ProjectPostsSummary,
      ...StudyPostsSummary,
    ];

    const sortedPosts = allPosts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    setRecentPosts(sortedPosts.slice(0, 3));

    const categoryMap = allPosts.reduce((acc, post) => {
      if (acc[post.category]) {
        acc[post.category]++;
      } else {
        acc[post.category] = 1;
      }

      return acc;
    }, {});

    const categoryList = Object.keys(categoryMap).map((category) => ({
      name: category,
      count: categoryMap[category],
    }));

    setCategories(categoryList);
  }, []);

  const handleClickProfile = () => {
    navigate("/about");
  };

  // const categories = [
  //   { name: "Frontend", count: 15 },
  //   { name: "Backend", count: 12 },
  //   { name: "DevOps", count: 8 },
  //   { name: "Mobile", count: 6 },
  //   { name: "AI/ML", count: 4 },
  //   { name: "Database", count: 7 },
  // ];

  return (
    <Container>
      <Hero theme={theme}>
        <HeroTitle theme={theme}>Dev Journey Log</HeroTitle>
        <HeroSubtitle theme={theme}>
          성장 여정을 기록하는 공간입니다.
          <br />
          기술 관련 인사이트와 경험을 공유합니다.
        </HeroSubtitle>
      </Hero>

      <Section>
        <SectionTitle theme={theme}>최근 포스트</SectionTitle>
        <Grid>
          {recentPosts.map((post) => (
            <FeaturedPost
              key={`${post.section + post.id}`}
              to={`/${post.section.toLowerCase()}/${post.id}`}
              theme={theme}
            >
              <PostTitle theme={theme}>{post.title}</PostTitle>
              <PostMeta theme={theme}>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.section}</span>
              </PostMeta>
              <p>{post.summary}</p>
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
              >
                {post.tags.map((tag) => (
                  <Tag key={tag} theme={theme}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </FeaturedPost>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle theme={theme}>카테고리</SectionTitle>
        <CategoryGrid>
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              to={`/etc/#${category.name.toLowerCase()}`}
              theme={theme}
            >
              <h3>{category.name}</h3>
              <p>{category.count}개의 포스트</p>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Section>

      <Section>
        <SectionTitle theme={theme}>프로필</SectionTitle>
        <Profile theme={theme} onClick={handleClickProfile}>
          <ProfileImage>👨‍💻</ProfileImage>
          <ProfileInfo>
            <h3>Frontend Developer</h3>
            <p>웹 개발과 사용자 경험에 대한 이야기를 공유합니다.</p>
            <p>
              React, TypeScript, 그리고 모던 웹 개발 생태계에 관심이 많습니다.
            </p>
          </ProfileInfo>
        </Profile>
      </Section>
    </Container>
  );
};

export default LandingPage;
