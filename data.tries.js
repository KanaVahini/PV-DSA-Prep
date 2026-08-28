// ============================================================
// DSA Tries — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["tries"] so
// multiple topic files can coexist without clashing on names.
//
// Grouped by the shape of the trie technique itself (raw node
// operations, DFS-driven string properties, bit-tries for XOR)
// rather than by source difficulty label — so problems that
// share a skeleton sit together and revise as a set.
// ============================================================
(function () {

const TOPIC = {
  id: "tries",
  title: "Tries",
  tagline: "A tree that branches one character (or one bit) at a time, so everything sharing a prefix shares a path. Once insert/traverse/query click for one trie, they click for all of them."
};

const PATTERNS = [
  {
    id: "trie-core",
    name: "Building the Trie — Core Structure & Operations",
    color: "#38bdf8",
    icon: "trie-core",
    trigger: "Storing a set of words so that prefix checks, exact lookups, and counts are all fast — the foundation every other trie problem builds on",
    summary: "The trie node itself, and the four operations built directly on top of it: insert, exact-match, prefix-match, and (with slightly richer nodes) count and delete. Every other pattern in this topic reuses this exact node shape without changing it.",
    problems: [
      {
        name: "Trie Implementation and Operations",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/implement-trie-prefix-tree/",
        idea: "A trie stores strings by branching one character at a time, so words sharing a prefix share the same path through the tree. Each node holds up to 26 children (one per lowercase letter) and a flag marking whether some inserted word ends exactly there. `insert` walks down the tree, creating a child node whenever a needed character link doesn't exist yet. `search` and `startsWith` walk that same path back — `search` additionally checks the end-of-word flag at the final node, while `startsWith` only needs to confirm the path exists at all.",
        time: "O(L) per operation, where L is the length of the word/prefix", space: "O(total characters inserted) nodes, worst case",
        code: `struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(string word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->isEnd = true;
    }

    bool search(string word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char ch : prefix) {
            int idx = ch - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;
    }
};`,
        variations: ["Trie Implementation and Advanced Operations, right below — swap the single boolean for per-node counters to support counting duplicates and deletion.", "Use `unordered_map<char, TrieNode*>` instead of a fixed 26-array when the alphabet is large or sparse — trades O(1) fixed access for lower memory."],
        gotchas: ["`startsWith` only needs to confirm the path exists — checking `isEnd` there by mistake would reject valid prefixes that just aren't themselves complete words.", "Forgetting to bail out the moment a required child pointer is null is a common crash — every traversal loop needs that check before advancing."]
      },
      {
        name: "Trie Implementation and Advanced Operations",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/implement-trie-ii-prefix-tree/",
        idea: "The exact same trie shape as before, but the single boolean `isEnd` is replaced with two integer counters per node: `countEndWith` (how many inserted words end exactly here) and `countPrefix` (how many inserted words pass through here at all). `insert` increments `countPrefix` at every node along the path and `countEndWith` at the final node. `countWordsEqualTo` and `countWordsStartingWith` just read those counters off the node reached by walking the word/prefix. `erase` walks the same path and decrements both counters — no node is ever physically deleted, it's just left at zero.",
        time: "O(L) per operation", space: "O(total characters inserted) nodes, worst case",
        code: `struct TrieNode {
    TrieNode* children[26] = {};
    int countEndWith = 0;
    int countPrefix = 0;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(string word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) node->children[idx] = new TrieNode();
            node = node->children[idx];
            node->countPrefix++;
        }
        node->countEndWith++;
    }

    int countWordsEqualTo(string word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) return 0;
            node = node->children[idx];
        }
        return node->countEndWith;
    }

    int countWordsStartingWith(string prefix) {
        TrieNode* node = root;
        for (char ch : prefix) {
            int idx = ch - 'a';
            if (!node->children[idx]) return 0;
            node = node->children[idx];
        }
        return node->countPrefix;
    }

    void erase(string word) {
        TrieNode* node = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!node->children[idx]) return; // not present — nothing to erase
            node = node->children[idx];
            node->countPrefix--;
        }
        node->countEndWith--;
    }
};`,
        variations: ["Physically remove now-unused nodes during `erase` (delete a node once both counters hit 0 and it has no children) to reclaim memory instead of leaving dead nodes behind.", "Trie Implementation and Operations above is this exact same skeleton with the counters collapsed down to a single boolean, for when duplicates and deletion don't matter."],
        gotchas: ["`erase` must never be called for a word that isn't in the trie (the problem guarantees this) — decrementing a counter that's already 0 silently corrupts every future count.", "Updating `countPrefix` without also updating `countEndWith` at the final node (or vice versa) breaks one of the two count queries — both counters move together on every insert and erase, every step of the way."]
      }
    ]
  },

  {
    id: "trie-string-traversal",
    name: "Traversing the Trie for String Properties",
    color: "#34d399",
    icon: "trie-string-traversal",
    trigger: "Answering a question about a whole set of strings — a longest valid one, or a total distinct count — where the SHAPE of the trie itself holds the answer",
    summary: "Both problems here insert everything into a trie first, then read the answer off the resulting tree structure instead of re-scanning the original strings. One walks the trie top-down checking end-of-word flags along the way; the other counts how many brand-new nodes get created during insertion.",
    problems: [
      {
        name: "Longest Word with All Prefixes",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-word-with-all-prefixes/",
        idea: "Insert every word into a standard trie, marking end-of-word nodes exactly like the core Trie Implementation problem. Then DFS down from the root: only continue into a child if that child is ITSELF marked as an end-of-word node — that's precisely the 'every prefix is present' condition, verified one character at a time as the DFS descends, instead of separately re-validating each candidate word from scratch afterward. Track the longest (and lexicographically smallest, on ties) word reached this way.",
        time: "O(sum of word lengths) to build the trie, plus O(sum of word lengths) for the DFS", space: "O(sum of word lengths) trie nodes",
        code: `struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

void insert(TrieNode* root, const string& word) {
    TrieNode* node = root;
    for (char ch : word) {
        int idx = ch - 'a';
        if (!node->children[idx]) node->children[idx] = new TrieNode();
        node = node->children[idx];
    }
    node->isEnd = true;
}

void dfs(TrieNode* node, string& path, string& best) {
    if (path.size() > best.size() || (path.size() == best.size() && path < best)) {
        best = path;
    }
    for (int c = 0; c < 26; c++) {
        if (node->children[c] && node->children[c]->isEnd) {
            path.push_back('a' + c);
            dfs(node->children[c], path, best);
            path.pop_back();
        }
    }
}

string longestWord(vector<string>& words) {
    TrieNode* root = new TrieNode();
    for (auto& w : words) insert(root, w);
    string path, best;
    dfs(root, path, best);
    return best;
}`,
        variations: ["Collect every complete word instead of just the best one — same DFS, append to a result list at each valid node instead of comparing against `best`.", "Number of Distinct Substrings, right below, also lets the trie's structure answer the question directly — no per-candidate re-validation there either."],
        gotchas: ["Only descend into a child if that child is marked `isEnd` — descending into any existing child regardless would let incomplete prefixes silently participate, breaking the 'every prefix must be a complete word' requirement.", "The length-then-lexicographic comparison against `best` is still necessary even though children are visited in a→z order — visit order alone doesn't guarantee the right word is picked."]
      },
      {
        name: "Number of distinct substrings in a string",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/problems/count-of-distinct-substrings/1",
        idea: "Every substring of a string is a prefix of one of its suffixes. So instead of building a trie over a list of words, build one trie over all n suffixes of the string, inserting them one character at a time. Every trie node created for the FIRST time during an insertion corresponds to exactly one distinct substring never encountered before — a character path that already exists just gets walked, not recreated. Counting the total number of new nodes created (excluding the root) gives the answer directly, with no extra bookkeeping.",
        time: "O(n^2) — n suffixes, each inserted in O(length)", space: "O(n^2) trie nodes worst case (e.g. a string with all distinct characters)",
        code: `struct TrieNode {
    TrieNode* children[26] = {};
};

int countDistinctSubstrings(const string& s) {
    TrieNode* root = new TrieNode();
    int count = 0;
    int n = s.size();
    for (int i = 0; i < n; i++) {
        TrieNode* node = root;
        for (int j = i; j < n; j++) {
            int idx = s[j] - 'a';
            if (!node->children[idx]) {
                node->children[idx] = new TrieNode();
                count++; // a brand-new node = a substring never seen before
            }
            node = node->children[idx];
        }
    }
    return count; // add 1 here if the empty substring should be counted
}`,
        variations: ["A suffix array + LCP array solves the same problem in O(n log n) — more setup, but scales past the quadratic trie approach.", "Longest Word with All Prefixes above builds its trie over a list of separate words rather than all suffixes of one string, but the underlying idea — let the trie's structure answer the question — is identical."],
        gotchas: ["Whether the empty substring counts depends on the exact problem statement — some versions want it included (+1 to the final count), others don't; check before submitting.", "This is O(n^2) time and space because there are n suffixes of total length O(n^2) — fine for small strings, but won't scale to much longer inputs without switching approaches."]
      }
    ]
  },

  {
    id: "trie-bitwise-xor",
    name: "Bit Tries — Maximizing XOR",
    color: "#fb923c",
    icon: "trie-bitwise-xor",
    trigger: "Finding the maximum possible XOR between one number and a set of others — the trie's alphabet shrinks from 26 letters down to just 2 bits",
    summary: "The same insert/traverse trie skeleton from the top group, but the 'characters' being inserted are the bits of a number's binary representation instead of letters. To maximize XOR, greedily prefer the OPPOSITE bit at every trie level, since differing bits are exactly what makes XOR large — and higher bit positions matter more, so the trie is walked from the most significant bit down.",
    problems: [
      {
        name: "Maximum XOR of two numbers in an array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
        idea: "Reframe every number as a fixed-length binary string (31 bits covers LeetCode's constraints) and insert all of them into a trie with only two children per node — 0 and 1 — instead of 26. To find the best partner for a number x, greedily walk this bit-trie: at every bit position, prefer the child representing the OPPOSITE of x's bit there, since a differing bit is what makes XOR large at that position. Take that child if it exists (and record a 1 in that result bit); otherwise take whichever child does exist.",
        time: "O(32n) — building the trie and querying every number both take O(n × 32)", space: "O(32n) trie nodes worst case",
        code: `struct TrieNode {
    TrieNode* children[2] = {};
};

void insert(TrieNode* root, int num) {
    TrieNode* node = root;
    for (int bit = 30; bit >= 0; bit--) {
        int b = (num >> bit) & 1;
        if (!node->children[b]) node->children[b] = new TrieNode();
        node = node->children[b];
    }
}

int queryMaxXor(TrieNode* root, int num) {
    TrieNode* node = root;
    int result = 0;
    for (int bit = 30; bit >= 0; bit--) {
        int b = (num >> bit) & 1;
        int wanted = b ^ 1; // opposite bit maximizes this position's contribution
        if (node->children[wanted]) {
            result |= (1 << bit);
            node = node->children[wanted];
        } else {
            node = node->children[b];
        }
    }
    return result;
}

int findMaximumXOR(vector<int>& nums) {
    TrieNode* root = new TrieNode();
    for (int num : nums) insert(root, num);
    int ans = 0;
    for (int num : nums) ans = max(ans, queryMaxXor(root, num));
    return ans;
}`,
        variations: ["Maximum XOR With an Element From Array, right below, adds an upper-bound constraint per query, solved by inserting into this exact same trie incrementally instead of all at once.", "A brute-force O(n^2) pairwise XOR scan is a useful way to sanity-check the trie result on small test cases while debugging."],
        gotchas: ["Insert and query must walk bits in the SAME fixed order (most significant to least significant), and with the SAME bit-width — mixing them up silently produces wrong answers.", "30 is used as the starting bit assuming values fit in 31 bits (LeetCode's constraint) — adjust the bit width to match the actual value range of whatever input is given."]
      },
      {
        name: "Maximum Xor with an element from an array",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
        idea: "The same bit-trie walk as above, but now each query [x, limit] restricts which numbers are even allowed to participate — only elements <= limit. Rebuilding the trie per query would be wasteful, so process queries OFFLINE instead: sort both `nums` and the queries by limit, and as each query is handled in increasing order of limit, insert every not-yet-inserted number that's <= that limit before answering it. Because limits only grow as queries are processed in this order, once a number is inserted it stays valid for every later query — nothing is ever inserted twice, and nothing needs to be removed.",
        time: "O((n + q) log(n + q)) for sorting, plus O((n + q) x 32) for the trie work", space: "O(32n) trie nodes",
        code: `struct TrieNode {
    TrieNode* children[2] = {};
};

void insert(TrieNode* root, int num) {
    TrieNode* node = root;
    for (int bit = 30; bit >= 0; bit--) {
        int b = (num >> bit) & 1;
        if (!node->children[b]) node->children[b] = new TrieNode();
        node = node->children[b];
    }
}

int queryMaxXor(TrieNode* root, int num) {
    TrieNode* node = root;
    int result = 0;
    for (int bit = 30; bit >= 0; bit--) {
        int b = (num >> bit) & 1;
        int wanted = b ^ 1;
        if (node->children[wanted]) { result |= (1 << bit); node = node->children[wanted]; }
        else if (node->children[b]) { node = node->children[b]; }
        else return -1; // trie is empty — no eligible number inserted yet
    }
    return result;
}

vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {
    sort(nums.begin(), nums.end());
    int q = queries.size();
    vector<int> order(q);
    iota(order.begin(), order.end(), 0);
    sort(order.begin(), order.end(), [&](int a, int b) {
        return queries[a][1] < queries[b][1];
    });

    TrieNode* root = new TrieNode();
    vector<int> ans(q);
    int j = 0, n = nums.size();
    for (int i : order) {
        int x = queries[i][0], limit = queries[i][1];
        while (j < n && nums[j] <= limit) { insert(root, nums[j]); j++; }
        ans[i] = (j == 0) ? -1 : queryMaxXor(root, x);
    }
    return ans;
}`,
        variations: ["Maximum XOR of Two Numbers in an Array above is the unconstrained version of this exact technique — no limit, no offline sorting needed.", "If queries have to be answered online (can't be reordered up front), a persistent or merge-sort trie is needed instead to query against 'only elements inserted so far in original order.'"],
        gotchas: ["Return -1 immediately if nothing has been inserted into the trie yet when a query is processed — since queries are handled in increasing limit order, `j == 0` reliably means no number is small enough for this query.", "Sorting queries by limit reorders them — write each answer back into `ans[i]` using the ORIGINAL query index stored in `order`, not the sorted position, or the output array ends up scrambled."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Insert, exact search, prefix search, count, or delete on a set of strings", pattern: "trie-core" },
  { keyword: "Let the shape of a built trie answer a longest/count question", pattern: "trie-string-traversal" },
  { keyword: "Maximize XOR of a number against a set, with a 2-child bit trie", pattern: "trie-bitwise-xor" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.tries = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();