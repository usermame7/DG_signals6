import { getUncachableGitHubClient } from './server/github-helper';

async function verifyPush() {
  const octokit = await getUncachableGitHubClient();
  const owner = 'usermame7';
  const repo = 'victorypipsfx-website';
  
  console.log('=== VERIFYING GITHUB STATUS ===\n');
  
  // Get latest commit
  const { data: commits } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 3
  });
  
  console.log('📋 Latest Commits on GitHub:\n');
  commits.forEach((commit, index) => {
    console.log(`${index + 1}. ${commit.sha.substring(0, 7)} - ${commit.commit.message}`);
    console.log(`   Date: ${commit.commit.author?.date}\n`);
  });
  
  // Check index.html for advanced matching
  const { data: indexHtml } = await octokit.repos.getContent({
    owner,
    repo,
    path: 'client/index.html'
  });
  
  if ('content' in indexHtml) {
    const content = Buffer.from(indexHtml.content, 'base64').toString('utf-8');
    const hasAdvancedMatching = content.includes("fbq('init', '1779555470055490', {");
    const hasEmailParam = content.includes("em:");
    const hasPhoneParam = content.includes("ph:");
    
    console.log('✅ Advanced Matching on GitHub:');
    console.log(`   - Init with parameters object: ${hasAdvancedMatching ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Email parameter (em): ${hasEmailParam ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Phone parameter (ph): ${hasPhoneParam ? '✅ YES' : '❌ NO'}`);
    
    if (hasAdvancedMatching) {
      console.log('\n✅ CONFIRMED: Advanced matching is live on GitHub!');
    }
  }
}

verifyPush().catch(console.error);
