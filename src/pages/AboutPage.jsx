import styled from "styled-components";
import { FaGithub, FaEnvelope } from "react-icons/fa";

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 4px solid #646cff;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Name = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: #646cff;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const SkillCategory = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
`;

const SkillCategoryTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: #555;
  display: flex;
  align-items: center;

  &:before {
    content: "•";
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const TimelineItem = styled.div`
  margin-bottom: 2rem;
  padding-left: 1.5rem;
  border-left: 2px solid #646cff;
`;

const TimelineTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TimelinePeriod = styled.div`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const TimelineDescription = styled.p`
  font-size: 1.2rem;
  color: #444;
  line-height: 1.6;
`;

const DEFAULT_IMAGE = "https://via.placeholder.com/300";

const AboutPage = () => {
  return (
    <PageContainer>
      <PageTitle>About Me</PageTitle>

      <ProfileSection>
        <div>
          <ProfileImage
            src="/api/placeholder/300/300"
            alt="Profile"
            onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
          />
        </div>
        <ProfileInfo>
          <Name>김태훈(Kim Taehun)</Name>
          <ContactInfo>
            <ContactLink href="mailto:kth32105@naver.com">
              <FaEnvelope /> kth32105@naver.com
            </ContactLink>
            <ContactLink href="https://github.com/horororok" target="_blank">
              <FaGithub /> github.com/horororok
            </ContactLink>
          </ContactInfo>
          <p style={{ fontSize: "1.4rem", lineHeight: "1.6", color: "#444" }}>
            프론트엔드 개발자를 꿈꾸는 주니어 개발자입니다. 사용자 경험을
            개선하고 효율적인 코드를 작성하는 것에 관심이 많습니다.
          </p>
        </ProfileInfo>
      </ProfileSection>

      <Section>
        <SectionTitle>Education</SectionTitle>
        <TimelineItem>
          <TimelineTitle>한양대학교(ERICA)</TimelineTitle>
          <TimelinePeriod>2016 - 2022</TimelinePeriod>
          <TimelineDescription>
            기계공학 전공으로 학사학위 취득
          </TimelineDescription>
        </TimelineItem>
      </Section>

      <Section>
        <SectionTitle>Experiences</SectionTitle>
        <TimelineItem>
          <TimelineTitle>Samsung Software Academy(SSAFY) 10th</TimelineTitle>
          <TimelinePeriod>2023.07 - 2024.06</TimelinePeriod>
          {/* <TimelineDescription>
            1600시간의 집중 교육(코딩 800시간, 심화 프로젝트 800시간)으로
            Java(객체지향, 자료구조, 멀티스레드 등), 웹 개발(Spring, Vue.js 등),
            MVC 아키텍처를 학습하고, 6인 팀프로젝트 3회와 영상 플랫폼 API 기반
            운동 정보 추천 서비스 개발을 수행
          </TimelineDescription> */}
        </TimelineItem>
        <TimelineItem>
          <TimelineTitle>Codeit Sprint: Frontend 11th</TimelineTitle>
          <TimelinePeriod>2024.08 - </TimelinePeriod>
          {/* <TimelineDescription>
            React, TypeScript, Next.js 등을 활용한 웹 개발 실무 과정
          </TimelineDescription> */}
        </TimelineItem>
        <TimelineItem>
          <TimelineTitle>
            Wanted: Pre-Onboarding Frontend Challenge
          </TimelineTitle>
          <TimelinePeriod>2024.11 - 2024.11 </TimelinePeriod>
          {/* <TimelineDescription>
            코드를 결합하는 패턴을 학습한 뒤 설계까지 진행
          </TimelineDescription> */}
        </TimelineItem>
      </Section>

      <Section>
        <SectionTitle>Skills</SectionTitle>
        <SkillsGrid>
          <SkillCategory>
            <SkillCategoryTitle>Languages</SkillCategoryTitle>
            <SkillList>
              <SkillItem>JavaScript</SkillItem>
              <SkillItem>TypeScript</SkillItem>
              <SkillItem>HTML5</SkillItem>
              <SkillItem>CSS3</SkillItem>
            </SkillList>
          </SkillCategory>

          <SkillCategory>
            <SkillCategoryTitle>Frameworks</SkillCategoryTitle>
            <SkillList>
              <SkillItem>React.js</SkillItem>
              <SkillItem>Next.js</SkillItem>
              <SkillItem>Node.js</SkillItem>
            </SkillList>
          </SkillCategory>

          <SkillCategory>
            <SkillCategoryTitle>Certifications</SkillCategoryTitle>
            <SkillList>
              <SkillItem>SQLD</SkillItem>
            </SkillList>
          </SkillCategory>
        </SkillsGrid>
      </Section>
    </PageContainer>
  );
};

export default AboutPage;
