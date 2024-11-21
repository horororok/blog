import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styled from "styled-components";

import { DevlifePostsSummary } from "../../posts/Devlife/DevlifePostsSummary";
import { ProjectPostsSummary } from "../../posts/Project/ProjectPostsSummary";
import { StudyPostsSummary } from "../../posts/Study/StudyPostsSummary";

const PostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PostLocation = styled.div`
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;

  span {
    &:last-child {
      text-decoration: underline;
    }

    &:hover {
      color: #646cff;
    }
  }
`;

const PostHeader = styled.div`
  margin-bottom: 2rem;
`;

const PostTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PostMeta = styled.div`
  color: #666;
  margin-bottom: 2rem;

  span {
    &:last-child {
      text-decoration: underline dotted;
    }
  }
`;

// 마크다운 컨텐츠를 위한 스타일 추가
const MarkdownContent = styled.div`
  // 테이블 스타일링
  table {
    border-collapse: collapse;
    margin: 1rem 0;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 0.5rem;
  }

  th {
    background-color: #f5f5f5;
  }

  // 인용문 스타일링
  blockquote {
    border-left: 4px solid #646cff;
    margin: 1rem 0;
    padding-left: 1rem;
    color: #666;
  }

  // 체크박스 스타일링
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }

  // 코드블록 마진 조정
  pre {
    margin: 1rem 0;
    border-radius: 4px;
  }

  // 인라인 코드 스타일링
  code {
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  // 이미지 스타일링
  img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
  }

  // 링크 스타일링
  a {
    color: #646cff;
    text-decoration: none;
  }
`;

const Posts = ({ section }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [currentPostList, setCurrentPostList] = useState("");

  const navigate = useNavigate();

  // 포스트 정보를 가져오기
  useEffect(() => {
    let posts;
    switch (section) {
      case "project":
        posts = ProjectPostsSummary;
        setCurrentPostList("Project");
        break;
      case "devlife":
        posts = DevlifePostsSummary;
        setCurrentPostList("Devlife");
        break;
      case "study":
        posts = StudyPostsSummary;
        setCurrentPostList("Study");
        break;
      default:
        posts = [];
    }

    const currentPost = posts.find((p) => p.id === parseInt(id));
    setPost(currentPost);
  }, [section, id]);

  // 포스트 컨텐츠를 가져오기
  useEffect(() => {
    if (post?.contentPath) {
      fetch(post.contentPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Content not found");
          }
          return response.text();
        })
        .then((data) => setPostContent(data))
        .catch((error) => {
          console.error("Failed to load post content:", error);
          setPostContent("");
        });
    }
  }, [post]);

  if (!post) {
    return (
      <PostContainer>
        <h2>포스트가 존재하지 않습니다.</h2>
      </PostContainer>
    );
  }

  const handleListClick = (list) => {
    navigate(`/${list}`);
  };

  return (
    <PostContainer>
      <PostLocation>
        <span onClick={() => handleListClick("")}>Home</span> /&nbsp;
        <span onClick={() => handleListClick(currentPostList)}>
          {currentPostList}
        </span>
      </PostLocation>
      <PostHeader>
        <PostTitle>{post.title}</PostTitle>
        <PostMeta>
          <span>{post.date}</span>
          <span> · </span>
          <span>{post.category}</span>
          <span> · </span>
          <span>{post.tags.join(", ")}</span>
        </PostMeta>
      </PostHeader>
      <MarkdownContent>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {postContent}
        </ReactMarkdown>
      </MarkdownContent>
    </PostContainer>
  );
};

export default Posts;
