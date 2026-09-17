import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Asterisk } from 'lucide-react';
import { posts } from '../../posts';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const post=posts.find(p=>p.slug===slug);
  return {title:post ? `${post.title} | Chen` : 'Not found | Chen',description:post?.description};
}
export default async function Article({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const post=posts.find(p=>p.slug===slug); if(!post)notFound();
  return <><header className="nav wrap"><Link href="/" className="wordmark">chen<Asterisk size={20}/></Link><Link className="text-link" href="/#contact">Let's talk <ArrowUpRight size={16}/></Link></header><main className="article"><Link className="back-link" href="/#writing"><ArrowLeft size={16}/> All field notes</Link><div className="post-meta">{post.category} / {post.minutes} MIN READ</div><h1>{post.title}</h1><p className="article-deck">{post.description}</p><div className="article-body">{post.paragraphs.map(p=><p key={p}>{p}</p>)}</div><div className="article-end"><p>Working through a similar question?</p><Link className="text-link" href="/#contact">Let's talk <ArrowUpRight size={18}/></Link></div></main><footer className="wrap footer"><span>Chen / Field notes</span><Link href="/">Home <ArrowUpRight size={15}/></Link></footer></>;
}
