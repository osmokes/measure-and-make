import { getCollection, type CollectionEntry } from "astro:content";
import { getArticles, type Article } from "./articles";

export type Topic = CollectionEntry<"topics">;

/** A topic together with its articles (newest first). */
export interface TopicWithArticles {
  topic: Topic;
  articles: Article[];
}

/** Every topic defined in topics.yaml, keyed by id, e.g. "structures". */
export async function getTopicMap(): Promise<Map<string, Topic>> {
  const topics = await getCollection("topics");
  return new Map(topics.map((topic) => [topic.id, topic]));
}

/**
 * The topic an article belongs to.
 *
 * Astro only logs a warning-style error for a reference to a topic that
 * doesn't exist (e.g. `topic: structurs`) and carries on building. Throwing
 * here makes such a typo stop the build instead.
 */
export function topicOf(article: Article, topics: Map<string, Topic>): Topic {
  const topic = topics.get(article.data.topic.id);
  if (!topic) {
    throw new Error(
      `Article "${article.id}" has topic "${article.data.topic.id}", which is ` +
        `not defined in src/content/topics.yaml. ` +
        `Known topics: ${[...topics.keys()].join(", ")}.`,
    );
  }
  return topic;
}

/**
 * Topics that have at least one article, alphabetically by name. (Astro
 * doesn't keep the order of entries in topics.yaml, so we sort explicitly.)
 * Topics with no published articles are left out, so the site never shows
 * an empty topic page.
 */
export async function getTopicsWithArticles(): Promise<TopicWithArticles[]> {
  const [topics, articles] = await Promise.all([getTopicMap(), getArticles()]);

  const groups = new Map<string, Article[]>();
  for (const article of articles) {
    const topic = topicOf(article, topics); // throws on an unknown topic
    groups.set(topic.id, [...(groups.get(topic.id) ?? []), article]);
  }

  return [...topics.values()]
    .filter((topic) => groups.has(topic.id))
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .map((topic) => ({ topic, articles: groups.get(topic.id)! }));
}
