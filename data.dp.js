// ============================================================
// DSA Dynamic Programming — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["dp"] so multiple
// topic files can coexist without clashing on names.
// ============================================================
(function () {

const TOPIC = {
  id: "dp",
  title: "Dynamic Programming",
  tagline: "Every DP problem is a recursion tree with repeated branches. Spot the repeats, cache them, and the exponential becomes polynomial."
};

const PATTERNS = [
  {
    id: "dp-fundamentals",
    name: "DP Fundamentals",
    color: "#ffd166",
    icon: "dp-fundamentals",
    trigger: "Before anything else — understanding what 'dynamic programming' actually means underneath the jargon",
    summary: "Every DP solution is the same idea, wearing four different outfits: plain recursion, recursion + memoization, tabulation, and tabulation with space optimization. Learn the progression once on a simple example, and every problem below is just that same progression applied to a trickier recurrence.",
    problems: [
      {
        name: "Understanding DP: Recursion → Memoization → Tabulation → Space Optimization",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/dynamic-programming/",
        idea: "Plain recursion re-solves the same smaller subproblem over and over (fibonacci(5) calls fibonacci(3) twice, fibonacci(2) three times...). Memoization fixes that by caching each subproblem's answer the first time it's computed, and just returning the cached value on repeat calls — same recursive shape, exponential time becomes linear. Tabulation flips the direction: instead of starting big and recursing down, build the answer from the smallest subproblem UP to the biggest, filling a table iteratively — same values computed, but no recursion/call-stack overhead. Space optimization then notices that most tabulation solutions only ever look back one or two rows, so the full table can shrink down to just a couple of variables.",
        time: "O(n) after optimization (from O(2^n) for plain recursion)", space: "O(1) after full optimization (from O(n) for memoization/tabulation)",
        code: `// 1. Plain recursion — correct, but re-does massive repeated work
int fibRecursive(int n) {
    if (n <= 1) return n;
    return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// 2. Memoization — same recursion, cache every answer once computed
int fibMemo(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}

// 3. Tabulation — build the answer bottom-up, no recursion at all
int fibTabulation(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}

// 4. Space-optimized — only the last two values are ever needed
int fibOptimized(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1; prev1 = cur;
    }
    return prev1;
}`,
        variations: [],
        gotchas: ["Every problem below follows this exact same four-stage progression — if a solution feels hard to write directly in tabulated form, write the recursive version first and convert it."]
      }
    ]
  },

  {
    id: "dp-1d",
    name: "1D DP",
    color: "#ef476f",
    icon: "dp-1d",
    trigger: "The answer for position i depends only on a small, fixed number of earlier positions",
    summary: "The simplest DP shape: one array, where dp[i] is built from dp[i-1], dp[i-2], or a small window of recent values.",
    problems: [
      {
        name: "Climbing Stairs",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/climbing-stairs/",
        idea: "To reach step i, your last move was either a single step from i-1, or a double step from i-2 — so the number of ways to reach step i is just the ways to reach i-1 plus the ways to reach i-2. That's the Fibonacci recurrence in disguise.",
        time: "O(n)", space: "O(1)",
        code: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1; prev1 = cur;
    }
    return prev1;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Frog Jump",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/geek-jump-dp-3/",
        idea: "The frog can jump from stone i-1 or i-2 onto stone i, each costing the height difference. dp[i] is the cheapest total cost to reach stone i, built from whichever of those two jumps is cheaper — same 'look back a fixed number of steps' shape as Climbing Stairs, just with a cost to minimize instead of ways to count.",
        time: "O(n)", space: "O(1)",
        code: `int frogJump(vector<int>& heights) {
    int n = heights.size();
    if (n == 1) return 0;
    int prev2 = 0, prev1 = abs(heights[1] - heights[0]);
    for (int i = 2; i < n; i++) {
        int fromOne = prev1 + abs(heights[i] - heights[i-1]);
        int fromTwo = prev2 + abs(heights[i] - heights[i-2]);
        int cur = min(fromOne, fromTwo);
        prev2 = prev1; prev1 = cur;
    }
    return prev1;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Frog Jump with K Distances",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/minimal-cost-to-reach-destination-using-a-train-dp-27/",
        idea: "Same idea as Frog Jump, but now the frog can jump anywhere from 1 to k stones back, not just 1 or 2. So instead of comparing just two previous options, loop back over all k possible previous stones and take the cheapest.",
        time: "O(n·k)", space: "O(n)",
        code: `int frogJumpK(vector<int>& heights, int k) {
    int n = heights.size();
    vector<int> dp(n, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i < n; i++) {
        for (int j = 1; j <= k && i - j >= 0; j++) {
            if (dp[i - j] != INT_MAX)
                dp[i] = min(dp[i], dp[i - j] + abs(heights[i] - heights[i - j]));
        }
    }
    return dp[n - 1];
}`,
        variations: [],
        gotchas: ["This can't be reduced to O(1) space the way plain Frog Jump can — you genuinely need the last k values, not just the last 2."]
      },
      {
        name: "House Robber (Maximum Sum of Non-Adjacent Elements)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/house-robber/",
        idea: "At every house, you have one real choice: rob it (and add its value to whatever the best total was two houses back, since you can't rob the one right before it), or skip it (and keep whatever the best total was one house back). Take whichever choice is bigger.",
        time: "O(n)", space: "O(1)",
        code: `int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = max(prev1, prev2 + x);
        prev2 = prev1; prev1 = cur;
    }
    return prev1;
}`,
        variations: ["House Robber II (houses arranged in a circle — run this twice, once excluding the first house and once excluding the last, then take the max)"],
        gotchas: []
      }
    ]
  },

  {
    id: "dp-grids",
    name: "DP on Grids",
    color: "#06d6a0",
    icon: "dp-grids",
    trigger: "Moving through a 2D (or 3D) grid, picking up values or avoiding obstacles, where each cell's answer depends on the cells before it",
    summary: "The recurrence looks the same as 1D DP, just with two directions to look back instead of one — dp[i][j] usually depends on dp[i-1][j] and dp[i][j-1].",
    problems: [
      {
        name: "Ninja's Training",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/geeks-training-dp-8/",
        idea: "Each day has 3 possible activities, and you can't repeat the same activity two days in a row. dp[day][lastActivity] tracks the best total points achievable up through this day, given which activity you did yesterday — today, try each activity that ISN'T yesterday's, and take whichever gives the best combined total.",
        time: "O(days · 3 · 3)", space: "O(1) with two rolling arrays of size 3",
        code: `int ninjaTraining(vector<vector<int>>& points) {
    vector<int> prev = {points[0][0], points[0][1], points[0][2]};
    for (int day = 1; day < (int)points.size(); day++) {
        vector<int> cur(3);
        for (int last = 0; last < 3; last++) {
            cur[last] = 0;
            for (int task = 0; task < 3; task++) {
                if (task != last) cur[last] = max(cur[last], points[day][task] + prev[task]);
            }
        }
        prev = cur;
    }
    return max({prev[0], prev[1], prev[2]});
}`,
        variations: [],
        gotchas: ["The state isn't just 'which day' — it's 'which day AND what did I do yesterday'. Missing that second dimension is the most common mistake here."]
      },
      {
        name: "Unique Paths",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/unique-paths/",
        idea: "You can only move right or down, so the number of ways to reach cell (i,j) is the ways to reach the cell above it plus the ways to reach the cell to its left — every path to (i,j) arrived from exactly one of those two.",
        time: "O(rows · cols)", space: "O(cols) with a rolling row",
        code: `int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Unique Paths II (with obstacles)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/unique-paths-ii/",
        idea: "Same recurrence as Unique Paths, with one extra rule: any cell with an obstacle has zero ways to reach it (and therefore can't contribute paths onward), regardless of what its neighbors say.",
        time: "O(rows · cols)", space: "O(cols)",
        code: `int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    int n = grid[0].size();
    vector<long> dp(n, 0);
    dp[0] = (grid[0][0] == 0) ? 1 : 0;
    for (int i = 0; i < (int)grid.size(); i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 1) { dp[j] = 0; continue; }
            if (j > 0) dp[j] += dp[j - 1];
        }
    }
    return dp[n - 1];
}`,
        variations: [],
        gotchas: ["Zero out an obstacle cell BEFORE adding in the contribution from the left — an obstacle blocks paths regardless of what's arriving from that direction."]
      },
      {
        name: "Minimum Path Sum / Minimum Falling Path Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/minimum-falling-path-sum/",
        idea: "Same grid-DP shape again, but now minimizing a cost instead of counting paths. For falling path sum specifically, each cell can only fall from the cell directly above, or diagonally above-left or above-right — take whichever of those three gives the cheapest path down, add this cell's own value.",
        time: "O(rows · cols)", space: "O(cols)",
        code: `int minFallingPathSum(vector<vector<int>>& matrix) {
    int n = matrix.size();
    vector<int> prev = matrix[0];
    for (int i = 1; i < n; i++) {
        vector<int> cur(n);
        for (int j = 0; j < n; j++) {
            int best = prev[j];
            if (j > 0) best = min(best, prev[j - 1]);
            if (j < n - 1) best = min(best, prev[j + 1]);
            cur[j] = matrix[i][j] + best;
        }
        prev = cur;
    }
    return *min_element(prev.begin(), prev.end());
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Triangle",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/triangle/",
        idea: "Work from the BOTTOM row upward instead of top-down — it avoids needing to track boundary conditions on the triangle's edges. dp[j] becomes the cheapest path from cell j down to the bottom; at each row moving up, combine the current value with the cheaper of the two cells diagonally below it.",
        time: "O(n²)", space: "O(n)",
        code: `int minimumTotal(vector<vector<int>>& triangle) {
    int n = triangle.size();
    vector<int> dp = triangle[n - 1];
    for (int i = n - 2; i >= 0; i--) {
        for (int j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1]);
        }
    }
    return dp[0];
}`,
        variations: [],
        gotchas: ["Working bottom-up sidesteps a lot of edge-case handling that a top-down version needs at the triangle's slanted sides."]
      },
      {
        name: "Cherry Pickup / Ninja and His Friends",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/two-people-collecting-max-value-in-a-grid-dp-15/",
        idea: "Two people walk through the grid at the same time, both moving down one row at a time. Instead of two separate 2D DPs, run ONE 3D DP: state is (row, col1, col2) — where both people are on the same row simultaneously. If they land on the same cell, only count that cell's value once; otherwise add both.",
        time: "O(rows · cols²)", space: "O(cols²) with a rolling row",
        code: `int maxCherries(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> dp(cols, vector<int>(cols, -1));
    for (int c1 = 0; c1 < cols; c1++)
        for (int c2 = 0; c2 < cols; c2++)
            dp[c1][c2] = grid[0][c1] + (c1 != c2 ? grid[0][c2] : 0);

    for (int row = 1; row < rows; row++) {
        vector<vector<int>> cur(cols, vector<int>(cols, -1));
        for (int c1 = 0; c1 < cols; c1++) {
            for (int c2 = 0; c2 < cols; c2++) {
                int best = -1;
                for (int d1 = -1; d1 <= 1; d1++) {
                    for (int d2 = -1; d2 <= 1; d2++) {
                        int nc1 = c1 + d1, nc2 = c2 + d2;
                        if (nc1 >= 0 && nc1 < cols && nc2 >= 0 && nc2 < cols && dp[nc1][nc2] != -1)
                            best = max(best, dp[nc1][nc2]);
                    }
                }
                if (best != -1) {
                    cur[c1][c2] = best + grid[row][c1] + (c1 != c2 ? grid[row][c2] : 0);
                }
            }
        }
        dp = cur;
    }
    int result = 0;
    for (int c1 = 0; c1 < cols; c1++)
        for (int c2 = 0; c2 < cols; c2++)
            result = max(result, dp[c1][c2]);
    return result;
}`,
        variations: [],
        gotchas: ["The 'only count once if both people land on the same cell' rule is the single most-forgotten detail in this problem."]
      }
    ]
  },

  {
    id: "dp-01-knapsack",
    name: "0/1 Knapsack & Subset Sum",
    color: "#118ab2",
    icon: "dp-01-knapsack",
    trigger: "Each item can be used AT MOST ONCE — include it or don't, and you're building toward a target sum or capacity",
    summary: "For every item, dp asks one question: include it (and reduce the remaining budget), or skip it (and move on)? Whichever choice leads to a better outcome wins.",
    problems: [
      {
        name: "Subset Sum Equal to Target",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/subset-sum-problem-dp-25/",
        idea: "dp[target] tracks whether some subset of the numbers seen so far can sum to exactly target. For each number, either it's part of the subset (check if target - number was achievable before) or it isn't (check if target was already achievable without it). Loop the target dimension from HIGH to LOW so each number is only considered once per subset (the 0/1 constraint).",
        time: "O(n · target)", space: "O(target)",
        code: `bool subsetSumToTarget(vector<int>& nums, int target) {
    vector<bool> dp(target + 1, false);
    dp[0] = true; // empty subset always sums to 0
    for (int x : nums) {
        for (int t = target; t >= x; t--) {
            dp[t] = dp[t] || dp[t - x];
        }
    }
    return dp[target];
}`,
        variations: ["Partition Equal Subset Sum (just check if total sum is even, then ask: can some subset sum to total/2?)"],
        gotchas: ["Looping the target from high to low (not low to high) is what keeps each item from being used more than once — this is the exact difference between 0/1 and unbounded knapsack."]
      },
      {
        name: "Partition a Set into Two Subsets with Minimum Absolute Difference",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/minimum-sum-partition-dp-18/",
        idea: "Run the Subset Sum DP once to find EVERY achievable subset sum up to totalSum. Then for each achievable sum s, the other subset sums to (total - s), and the difference between them is `|total - 2s|`. Just scan through all achievable sums and pick whichever minimizes that difference.",
        time: "O(n · totalSum)", space: "O(totalSum)",
        code: `int minSubsetSumDifference(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    vector<bool> dp(total + 1, false);
    dp[0] = true;
    for (int x : nums)
        for (int t = total; t >= x; t--)
            dp[t] = dp[t] || dp[t - x];

    int best = INT_MAX;
    for (int s = 0; s <= total / 2; s++) {
        if (dp[s]) best = min(best, total - 2 * s);
    }
    return best;
}`,
        variations: [],
        gotchas: ["Only need to check sums up to total/2 — beyond that point you're just re-finding the same pairs of subsets in reverse."]
      },
      {
        name: "Count Subsets with Sum K",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/target-sum/",
        idea: "Same skeleton as Subset Sum, but counting ways instead of checking possibility. dp[t] becomes the NUMBER of subsets summing to t — for each number, add in however many ways t - number was achievable before, since choosing to include this number extends each of those.",
        time: "O(n · target)", space: "O(target)",
        code: `int countSubsetsWithSumK(vector<int>& nums, int k) {
    vector<int> dp(k + 1, 0);
    dp[0] = 1;
    for (int x : nums) {
        for (int t = k; t >= x; t--) {
            dp[t] += dp[t - x];
        }
    }
    return dp[k];
}`,
        variations: [],
        gotchas: ["Watch for zeros in the input — a zero can be 'included' or 'excluded' and still contribute the same sum, which doubles some counts if handled carelessly."]
      },
      {
        name: "Count Partitions with a Given Difference",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/partitions-with-given-difference/",
        idea: "If two subsets have sums s1 and s2 with s1 + s2 = total and s1 - s2 = diff, then algebra gives s1 = (total + diff) / 2. So this reduces directly to 'Count Subsets with Sum K', using that computed target — same code, just work out the right target first. (This is also exactly what 'Target Sum' reduces to, once you notice assigning +/- signs to numbers is the same as splitting them into two subsets.)",
        time: "O(n · total)", space: "O(total)",
        code: `int countPartitionsWithDifference(vector<int>& nums, int diff) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if ((total + diff) % 2 != 0 || total < diff) return 0; // no valid split exists
    int target = (total + diff) / 2;
    // reuse the exact Count Subsets with Sum K function above
    vector<int> dp(target + 1, 0);
    dp[0] = 1;
    for (int x : nums)
        for (int t = target; t >= x; t--)
            dp[t] += dp[t - x];
    return dp[target];
}`,
        variations: ["Target Sum (assigning +/- signs to reach a target — algebraically identical to this problem)"],
        gotchas: ["Check `(total + diff) % 2 != 0` first — if it's odd, no integer subset sum can produce that exact difference, so the answer is immediately 0."]
      }
    ]
  },

  {
    id: "dp-unbounded-knapsack",
    name: "Unbounded Knapsack & Coin Change",
    color: "#26a69a",
    icon: "dp-unbounded-knapsack",
    trigger: "Each item can be used ANY NUMBER of times — unlimited coins, unlimited rod cuts, unlimited copies",
    summary: "Almost identical to 0/1 Knapsack, with exactly one line different: since an item can be reused, the inner loop runs LOW to HIGH instead of high to low, letting the same item be picked again after being picked once.",
    problems: [
      {
        name: "Unbounded Knapsack",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/unbounded-knapsack-repetition-items-allowed/",
        idea: "Same value-maximizing knapsack idea as 0/1, but each item has an unlimited supply. That single change means looping the capacity dimension from LOW to HIGH — after 'using' an item at a smaller capacity, the same item is allowed to be used again reaching a bigger capacity.",
        time: "O(n · capacity)", space: "O(capacity)",
        code: `int unboundedKnapsack(vector<int>& weights, vector<int>& values, int capacity) {
    vector<int> dp(capacity + 1, 0);
    for (int i = 0; i < (int)weights.size(); i++) {
        for (int cap = weights[i]; cap <= capacity; cap++) { // low to high — reuse allowed
            dp[cap] = max(dp[cap], dp[cap - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}`,
        variations: ["Rod Cutting Problem (identical technique — the 'items' are just each possible cut length, with value = price for that length)"],
        gotchas: ["The loop direction (low-to-high here vs. high-to-low in 0/1 Knapsack) is the entire difference between 'each item once' and 'each item unlimited times' — everything else about the code is the same."]
      },
      {
        name: "Coin Change (Minimum Coins)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/coin-change/",
        idea: "Unbounded knapsack, minimizing the count of coins instead of maximizing value. dp[amount] is the fewest coins needed to make that amount; for each coin, check if using it (on top of the best answer for amount - coin) beats the current best.",
        time: "O(coins · amount)", space: "O(amount)",
        code: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int coin : coins) {
        for (int a = coin; a <= amount; a++) {
            if (dp[a - coin] != INT_MAX) dp[a] = min(dp[a], dp[a - coin] + 1);
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
        variations: [],
        gotchas: ["Guard against `dp[a - coin]` being 'unreachable' (INT_MAX) before adding 1 to it — otherwise you risk a silent overflow."]
      },
      {
        name: "Coin Change II (Count the Number of Ways)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/coin-change-ii/",
        idea: "Same unbounded-knapsack shape, but counting combinations instead of minimizing count. The key subtlety: loop coins on the OUTSIDE and amount on the inside — this ensures each combination is counted once regardless of coin order (1+2 and 2+1 are the same combination, not two different ones).",
        time: "O(coins · amount)", space: "O(amount)",
        code: `int change(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;
    for (int coin : coins) {
        for (int a = coin; a <= amount; a++) {
            dp[a] += dp[a - coin];
        }
    }
    return dp[amount];
}`,
        variations: [],
        gotchas: ["If coins were the INNER loop instead of the outer one, you'd count permutations (1+2 and 2+1 separately) instead of combinations — a subtle but very common bug."]
      }
    ]
  },

  {
    id: "dp-strings",
    name: "DP on Strings",
    color: "#ab47bc",
    icon: "dp-strings",
    trigger: "Comparing or transforming two strings (or one string against itself) — subsequences, substrings, edit operations",
    summary: "Almost every one of these builds a 2D table where dp[i][j] represents 'the answer using the first i characters of one string and the first j characters of the other'.",
    problems: [
      {
        name: "Longest Common Subsequence",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-common-subsequence/",
        idea: "If the current characters of both strings match, they're definitely part of the answer — extend the best result from one character back in both strings. If they don't match, the best answer is whichever is better: dropping the current character from string one, or dropping it from string two.",
        time: "O(m·n)", space: "O(n) with a rolling row",
        code: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<int> prev(n + 1, 0), cur(n + 1, 0);
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1]) cur[j] = 1 + prev[j-1];
            else cur[j] = max(prev[j], cur[j-1]);
        }
        prev = cur;
    }
    return prev[n];
}`,
        variations: ["Print the LCS itself (walk the filled table backward from dp[m][n], moving diagonally on a match)", "Minimum Insertions/Deletions to Convert String A to B (insertions = n - LCS, deletions = m - LCS)"],
        gotchas: ["This exact table is the foundation for a huge number of string DP problems below — it's worth being able to write from memory."]
      },
      {
        name: "Longest Common Substring",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/longest-common-substring-dp-29/",
        idea: "Unlike LCS (which allows gaps), a substring must be CONTIGUOUS — so the moment characters stop matching, the current streak has to reset to zero rather than falling back to a smaller earlier value. Track the best streak length seen anywhere in the table, not just the final cell.",
        time: "O(m·n)", space: "O(n)",
        code: `int longestCommonSubstring(string a, string b) {
    int m = a.size(), n = b.size(), best = 0;
    vector<int> prev(n + 1, 0), cur(n + 1, 0);
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a[i-1] == b[j-1]) { cur[j] = 1 + prev[j-1]; best = max(best, cur[j]); }
            else cur[j] = 0; // must reset — substrings can't skip characters
        }
        prev = cur;
    }
    return best;
}`,
        variations: [],
        gotchas: ["Resetting to 0 on a mismatch (instead of taking the max of neighbors like LCS does) is the single-line difference that changes 'subsequence' into 'substring'."]
      },
      {
        name: "Longest Palindromic Subsequence",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-palindromic-subsequence/",
        idea: "A palindrome reads the same forwards and backwards — so the longest palindromic subsequence of a string is just the longest common subsequence between the string AND ITS OWN REVERSE. No new algorithm needed, just a clever reduction to LCS.",
        time: "O(n²)", space: "O(n)",
        code: `int longestPalindromeSubseq(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    int n = s.size();
    vector<int> prev(n + 1, 0), cur(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (s[i-1] == rev[j-1]) cur[j] = 1 + prev[j-1];
            else cur[j] = max(prev[j], cur[j-1]);
        }
        prev = cur;
    }
    return prev[n];
}`,
        variations: ["Minimum Insertions to Make a String Palindrome (= length - longestPalindromeSubseq — every character not in the palindromic subsequence needs a matching insertion)"],
        gotchas: ["Recognizing 'this reduces to LCS on the reversed string' is the entire trick — don't try to write a new recurrence from scratch."]
      },
      {
        name: "Shortest Common Supersequence",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/shortest-common-supersequence/",
        idea: "The shortest string containing both inputs as subsequences reuses their LCS as much as possible (no point duplicating characters that already overlap). Its length is `len(a) + len(b) - LCS(a, b)`. To construct the actual string, walk the LCS table backward: on a match, take the shared character once; on a mismatch, take whichever character belongs to the path that led to the larger LCS value, and include it.",
        time: "O(m·n)", space: "O(m·n) (full table needed to reconstruct the string)",
        code: `string shortestCommonSupersequence(string a, string b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (a[i-1] == b[j-1]) ? 1 + dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1]);

    string result;
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (a[i-1] == b[j-1]) { result += a[i-1]; i--; j--; }
        else if (dp[i-1][j] > dp[i][j-1]) { result += a[i-1]; i--; }
        else { result += b[j-1]; j--; }
    }
    while (i > 0) { result += a[i-1]; i--; }
    while (j > 0) { result += b[j-1]; j--; }
    reverse(result.begin(), result.end());
    return result;
}`,
        variations: [],
        gotchas: ["Unlike most of the other string DP problems here, this one needs the FULL 2D table (not a rolling row) since reconstructing the actual string requires walking back through it."]
      },
      {
        name: "Distinct Subsequences",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/distinct-subsequences/",
        idea: "Counting how many ways string s's subsequence can match string t. If the current characters match, there are two options: use this match (move both pointers back) or skip this character of s and still try to match t here (move only s's pointer) — add both counts together. If they don't match, skipping this character of s is the only option.",
        time: "O(m·n)", space: "O(n)",
        code: `int numDistinct(string s, string t) {
    int m = s.size(), n = t.size();
    vector<long> prev(n + 1, 0), cur(n + 1, 0);
    prev[0] = cur[0] = 1; // empty t is always matched exactly one way
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s[i-1] == t[j-1]) cur[j] = prev[j-1] + prev[j];
            else cur[j] = prev[j];
        }
        prev = cur;
    }
    return (int)prev[n];
}`,
        variations: [],
        gotchas: ["Base case: an empty target string t is matched by exactly 1 subsequence (the empty one) no matter what s is — seed the table with that before the main loop."]
      },
      {
        name: "Edit Distance",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/edit-distance/",
        idea: "At each pair of positions, either the characters match (no operation needed, move both pointers back), or they don't — in which case try all three operations (insert, delete, replace) and take whichever leads to the cheapest overall result, adding 1 for the operation itself.",
        time: "O(m·n)", space: "O(n)",
        code: `int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<int> prev(n + 1), cur(n + 1);
    for (int j = 0; j <= n; j++) prev[j] = j; // converting "" to word2[0..j] takes j insertions
    for (int i = 1; i <= m; i++) {
        cur[0] = i; // converting word1[0..i] to "" takes i deletions
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1]) cur[j] = prev[j-1];
            else cur[j] = 1 + min({prev[j-1], prev[j], cur[j-1]}); // replace, delete, insert
        }
        prev = cur;
    }
    return prev[n];
}`,
        variations: [],
        gotchas: ["The base row/column (converting to or from an empty string) is pure insertions or deletions — get those initialized correctly before the main recurrence."]
      },
      {
        name: "Wildcard Matching",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/wildcard-matching/",
        idea: "'?' matches any single character (easy — just check the pattern moves forward with the text). '*' is the tricky one: it can match ZERO characters (skip the star) or match the current text character and stay put (try matching more with the same star), so try both and see if either path succeeds.",
        time: "O(m·n)", space: "O(n)",
        code: `bool isMatch(string s, string p) {
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));
    dp[0][0] = true;
    for (int j = 1; j <= n; j++)
        if (p[j-1] == '*') dp[0][j] = dp[0][j-1]; // a leading '*' can match empty string

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p[j-1] == '?' || p[j-1] == s[i-1]) dp[i][j] = dp[i-1][j-1];
            else if (p[j-1] == '*') dp[i][j] = dp[i][j-1] || dp[i-1][j]; // skip star, or use star on this char
            else dp[i][j] = false;
        }
    }
    return dp[m][n];
}`,
        variations: [],
        gotchas: ["Initializing the first row for leading `*` patterns is easy to forget — without it, patterns like `\"*\"` matching an empty string will incorrectly fail."]
      }
    ]
  },

  {
    id: "dp-stocks",
    name: "DP on Stocks (State Machine)",
    color: "#ff7043",
    icon: "dp-stocks",
    trigger: "Buy-low-sell-high style problems with a LIMIT on the number of transactions, a cooldown, or a fee — the plain greedy trick from Kadane's stops working",
    summary: "Model each day as being in one of a few STATES (holding a stock or not, which transaction number you're on) and let the DP transition between states day by day, taking whichever action is better.",
    problems: [
      {
        name: "Best Time to Buy and Sell Stock II (unlimited transactions)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
        idea: "Two states per day: holding a stock, or not holding one. If you hold today, you either already held yesterday, or you just bought today (paying for it, so subtract the price). If you don't hold today, you either already didn't hold yesterday, or you just sold today (gaining the price). Track both running maximums day by day.",
        time: "O(n)", space: "O(1)",
        code: `int maxProfit(vector<int>& prices) {
    int hold = INT_MIN, notHold = 0;
    for (int price : prices) {
        int newHold = max(hold, notHold - price);
        int newNotHold = max(notHold, hold + price);
        hold = newHold; notHold = newNotHold;
    }
    return notHold;
}`,
        variations: [],
        gotchas: ["Unlimited transactions means you can buy the very next day after selling — no restriction between trades in this version."]
      },
      {
        name: "Best Time to Buy and Sell Stock III (at most 2 transactions)",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
        idea: "Same holding/not-holding state idea, but now tracked separately PER transaction number (1st buy, 1st sell, 2nd buy, 2nd sell). Each state only depends on the state 'one step earlier' in the transaction sequence, so four running variables replace the two from the unlimited version.",
        time: "O(n)", space: "O(1)",
        code: `int maxProfit(vector<int>& prices) {
    int buy1 = INT_MIN, sell1 = 0, buy2 = INT_MIN, sell2 = 0;
    for (int price : prices) {
        buy1 = max(buy1, -price);
        sell1 = max(sell1, buy1 + price);
        buy2 = max(buy2, sell1 - price);
        sell2 = max(sell2, buy2 + price);
    }
    return sell2;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Best Time to Buy and Sell Stock IV (at most k transactions)",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
        idea: "Generalize Stock III from exactly 2 transactions to k — instead of 4 hardcoded variables, keep two arrays of size k (one for 'holding after the j-th buy', one for 'not holding after the j-th sell'), and loop over all k transaction slots for every day.",
        time: "O(n·k)", space: "O(k)",
        code: `int maxProfit(int k, vector<int>& prices) {
    vector<int> buy(k + 1, INT_MIN), sell(k + 1, 0);
    for (int price : prices) {
        for (int j = 1; j <= k; j++) {
            buy[j] = max(buy[j], sell[j-1] - price);
            sell[j] = max(sell[j], buy[j] + price);
        }
    }
    return sell[k];
}`,
        variations: ["Best Time to Buy and Sell Stock I (this problem with k = 1)", "Best Time to Buy and Sell Stock III (this problem with k = 2)"],
        gotchas: []
      },
      {
        name: "Best Time to Buy and Sell Stock with Cooldown",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
        idea: "Same holding/not-holding idea as the unlimited-transactions version, but buying today requires that you weren't just holding-and-sold YESTERDAY — there's a mandatory one-day cooldown after selling. That means 'not holding' needs to be split into 'not holding, free to buy' and 'not holding, just sold (cooling down)'.",
        time: "O(n)", space: "O(1)",
        code: `int maxProfit(vector<int>& prices) {
    int hold = INT_MIN, sold = 0, rest = 0;
    for (int price : prices) {
        int prevSold = sold;
        sold = hold + price;             // sell today
        hold = max(hold, rest - price);  // keep holding, or buy today (must not have just sold)
        rest = max(rest, prevSold);      // stay resting, or cooldown just ended
    }
    return max(sold, rest);
}`,
        variations: [],
        gotchas: ["Save `sold`'s previous value before overwriting it — `rest` needs YESTERDAY's sold state, not today's, or the cooldown rule breaks."]
      },
      {
        name: "Best Time to Buy and Sell Stock with Transaction Fee",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
        idea: "Identical to the unlimited-transactions version, except a fee is subtracted every time you complete a sale (or equivalently, every time you buy — pick one consistently). That one small change to the recurrence is the entire difference.",
        time: "O(n)", space: "O(1)",
        code: `int maxProfit(vector<int>& prices, int fee) {
    int hold = INT_MIN, notHold = 0;
    for (int price : prices) {
        int newHold = max(hold, notHold - price);
        int newNotHold = max(notHold, hold + price - fee);
        hold = newHold; notHold = newNotHold;
    }
    return notHold;
}`,
        variations: [],
        gotchas: ["Subtract the fee exactly once per completed transaction — subtracting it on both the buy AND the sell double-charges it."]
      }
    ]
  },

  {
    id: "dp-lis",
    name: "DP on LIS (Longest Increasing Subsequence)",
    color: "#5c6bc0",
    icon: "dp-lis",
    trigger: "\"Longest increasing/divisible/chain-able subsequence\" — picking a subset that must keep some ordering rule, in the original order",
    summary: "dp[i] means 'the length of the best qualifying subsequence that ENDS exactly at index i'. Build it by checking every earlier index that could legally come before i.",
    problems: [
      {
        name: "Longest Increasing Subsequence (O(n²))",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-increasing-subsequence/",
        idea: "dp[i] is the length of the longest increasing subsequence ending exactly at index i. For each i, look at every earlier index j — if nums[j] < nums[i], this element could extend that subsequence, so dp[i] could be dp[j] + 1. Take the best option across all valid j.",
        time: "O(n²)", space: "O(n)",
        code: `int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    int best = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);
        }
        best = max(best, dp[i]);
    }
    return best;
}`,
        variations: ["Print the actual LIS (track a 'parent' index alongside dp[i], then walk backward from the best ending index)"],
        gotchas: []
      },
      {
        name: "Longest Increasing Subsequence (O(n log n))",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/longest-increasing-subsequence/",
        idea: "Maintain an array representing 'the smallest possible tail value for an increasing subsequence of each length seen so far'. For each new number, binary search for where it belongs in that array (its lower bound) and overwrite that position — keeping tails as small as possible always gives future numbers the best chance to extend the subsequence. The final array's length is the LIS length (though the array itself isn't necessarily a valid subsequence).",
        time: "O(n log n)", space: "O(n)",
        code: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
        variations: [],
        gotchas: ["The `tails` array is NOT the actual longest increasing subsequence — it's a working structure that happens to end up the right LENGTH. Reconstructing the real subsequence needs extra bookkeeping."]
      },
      {
        name: "Largest Divisible Subset",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/largest-divisible-subset/",
        idea: "Exactly the LIS recurrence, with the ordering condition swapped from 'increasing' to 'evenly divides'. Sort the array first (so any valid chain is automatically increasing too, which makes the divisibility check one-directional), then run the same dp[i] = best chain ending at i logic.",
        time: "O(n²)", space: "O(n)",
        code: `vector<int> largestDivisibleSubset(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    int n = nums.size();
    vector<int> dp(n, 1), parent(n, -1);
    int bestIdx = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] % nums[j] == 0 && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
            }
        }
        if (dp[i] > dp[bestIdx]) bestIdx = i;
    }
    vector<int> result;
    for (int i = bestIdx; i != -1; i = parent[i]) result.push_back(nums[i]);
    reverse(result.begin(), result.end());
    return result;
}`,
        variations: [],
        gotchas: ["Sorting first is essential — without it, `nums[i] % nums[j] == 0` alone doesn't guarantee a valid ordering."]
      },
      {
        name: "Longest String Chain",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-string-chain/",
        idea: "Same LIS shape once more, with 'increasing' swapped for 'can be formed by inserting exactly one character'. Sort words by length first, then for each word, try removing one character at a time to see if the shorter result is a word that already has a known chain length — extend from whichever gives the longest chain.",
        time: "O(n · L²) where L is average word length", space: "O(n)",
        code: `int longestStrChain(vector<string>& words) {
    sort(words.begin(), words.end(), [](const string& a, const string& b) { return a.size() < b.size(); });
    unordered_map<string, int> best;
    int result = 1;
    for (string& word : words) {
        int cur = 1;
        for (int i = 0; i < (int)word.size(); i++) {
            string predecessor = word.substr(0, i) + word.substr(i + 1);
            if (best.count(predecessor)) cur = max(cur, best[predecessor] + 1);
        }
        best[word] = cur;
        result = max(result, cur);
    }
    return result;
}`,
        variations: [],
        gotchas: ["Sorting by length (not alphabetically) is what guarantees every possible predecessor has already been processed by the time you need to look it up."]
      },
      {
        name: "Longest Bitonic Subsequence",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/longest-bitonic-subsequence-dp-15/",
        idea: "A bitonic subsequence goes up, then down. Run plain LIS from the left to get, for every index, the longest increasing run ending there. Separately run LIS from the right (equivalent to longest DEcreasing run starting there) for every index. The best bitonic subsequence through any index i is `LIS-ending-at-i + LIS-starting-at-i - 1` (subtracting 1 since index i gets counted in both halves).",
        time: "O(n²)", space: "O(n)",
        code: `int longestBitonicSubsequence(vector<int>& nums) {
    int n = nums.size();
    vector<int> lisEndingHere(n, 1), ldsStartingHere(n, 1);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i]) lisEndingHere[i] = max(lisEndingHere[i], lisEndingHere[j] + 1);
    for (int i = n - 1; i >= 0; i--)
        for (int j = n - 1; j > i; j--)
            if (nums[j] < nums[i]) ldsStartingHere[i] = max(ldsStartingHere[i], ldsStartingHere[j] + 1);
    int best = 0;
    for (int i = 0; i < n; i++) best = max(best, lisEndingHere[i] + ldsStartingHere[i] - 1);
    return best;
}`,
        variations: [],
        gotchas: ["Every strictly increasing or strictly decreasing sequence counts as bitonic too (the 'up' or 'down' part is just empty) — don't require both halves to be non-trivial."]
      },
      {
        name: "Number of Longest Increasing Subsequences",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/number-of-longest-increasing-subsequences/",
        idea: "Track two things at each index instead of one: the length of the LIS ending there, AND how many distinct subsequences achieve that length. When extending from an earlier index j, if it produces a NEW longest length at i, reset the count to j's count; if it TIES the current best length at i, add j's count in (since it's another distinct way to reach that same length).",
        time: "O(n²)", space: "O(n)",
        code: `int findNumberOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> length(n, 1), count(n, 1);
    int maxLen = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                if (length[j] + 1 > length[i]) { length[i] = length[j] + 1; count[i] = count[j]; }
                else if (length[j] + 1 == length[i]) { count[i] += count[j]; }
            }
        }
        maxLen = max(maxLen, length[i]);
    }
    int result = 0;
    for (int i = 0; i < n; i++) if (length[i] == maxLen) result += count[i];
    return result;
}`,
        variations: [],
        gotchas: ["The count only carries over when the new length STRICTLY beats the old one (reset) versus TIES it (accumulate) — mixing those two cases up is the most common bug here."]
      }
    ]
  },

  {
    id: "dp-partition-mcm",
    name: "MCM / Partition DP",
    color: "#ec6ea5",
    icon: "dp-partition-mcm",
    trigger: "\"What's the best way to split this sequence/expression/string into pieces\" — the cost depends on WHERE you cut, and cuts can nest inside each other",
    summary: "Pick every possible 'last cut' point for a range, solve both resulting halves recursively, and combine — usually with a triple nested loop over range-start, range-end, and cut-point.",
    problems: [
      {
        name: "Matrix Chain Multiplication",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/matrix-chain-multiplication-dp-8/",
        idea: "The cost of multiplying a chain of matrices depends entirely on the ORDER you multiply them in. For a range of matrices [i, j], try every possible split point k — multiply the left part [i,k] and right part [k+1,j] separately (recursively), then combine them, paying the cost of that final multiplication. Take whichever split point minimizes the total.",
        time: "O(n³)", space: "O(n²)",
        code: `int matrixChainOrder(vector<int>& dims) {
    int n = dims.size() - 1; // number of matrices
    vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
    for (int len = 2; len <= n; len++) {
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + dims[i-1] * dims[k] * dims[j];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    return dp[1][n];
}`,
        variations: [],
        gotchas: ["This is the template most other partition DP problems below are adapted from — the triple loop (range length, range start, split point) is worth memorizing as a skeleton."]
      },
      {
        name: "Minimum Cost to Cut a Stick",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
        idea: "Same MCM skeleton: for a stick segment between two existing cut points, try every possible NEXT cut inside it, recursively solving the two resulting sub-segments, and pay the full length of the current segment for making this cut (since cutting a stick costs its current length, however long that piece currently is).",
        time: "O(k³) where k is the number of cut positions", space: "O(k²)",
        code: `int minCostCutStick(int n, vector<int>& cuts) {
    vector<int> points = cuts;
    points.push_back(0);
    points.push_back(n);
    sort(points.begin(), points.end());
    int m = points.size();
    vector<vector<int>> dp(m, vector<int>(m, 0));
    for (int len = 2; len < m; len++) {
        for (int i = 0; i + len < m; i++) {
            int j = i + len;
            dp[i][j] = INT_MAX;
            for (int k = i + 1; k < j; k++) {
                int cost = dp[i][k] + dp[k][j] + (points[j] - points[i]);
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    return dp[0][m-1];
}`,
        variations: [],
        gotchas: ["Adding 0 and n as artificial 'boundary cuts' turns this into a clean MCM-shaped problem instead of needing special edge handling."]
      },
      {
        name: "Burst Balloons",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/burst-balloons/",
        idea: "The twist: think about which balloon is burst LAST in a range, not first. If balloon k is the last one popped in range [i, j], then everything else in that range has already been cleared out — so k's neighbors at burst time are whatever's OUTSIDE the range (at i-1 and j+1), not its current neighbors. This reframing turns a confusing 'what pops first' problem into a clean MCM-style range DP.",
        time: "O(n³)", space: "O(n²)",
        code: `int maxCoins(vector<int>& nums) {
    int n = nums.size();
    vector<int> balloons(n + 2, 1);
    for (int i = 0; i < n; i++) balloons[i + 1] = nums[i];
    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
    for (int len = 1; len <= n; len++) {
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            for (int k = i; k <= j; k++) {
                int coins = balloons[i-1] * balloons[k] * balloons[j+1] + dp[i][k-1] + dp[k+1][j];
                dp[i][j] = max(dp[i][j], coins);
            }
        }
    }
    return dp[1][n];
}`,
        variations: [],
        gotchas: ["The 'think about what's burst LAST, not first' reframing is the entire trick — trying to simulate burst order directly leads to a much messier, harder problem."]
      },
      {
        name: "Different Ways to Evaluate a Boolean Expression",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/boolean-parenthesization-dp-37/",
        idea: "For a range of the expression, try every operator as the LAST one to be applied — that operator splits the range into a left boolean sub-expression and a right one. Recursively count how many ways the left evaluates to true/false, and the same for the right, then combine those counts based on what the current operator (AND/OR/XOR) requires to produce true or false overall.",
        time: "O(n³)", space: "O(n²)",
        code: `// dpTrue[i][j] / dpFalse[i][j] = number of ways the expression from operand i to j evaluates to true/false
// for each operator position k between i and j, combine left and right sub-results based on
// whether the operator is AND, OR, or XOR, adding to dpTrue or dpFalse accordingly
pair<long,long> countWays(string& expr, int i, int j, vector<vector<pair<long,long>>>& memo) {
    if (i == j) return { expr[i] == 'T' ? 1 : 0, expr[i] == 'F' ? 1 : 0 };
    if (memo[i][j].first != -1) return memo[i][j];
    long totalTrue = 0, totalFalse = 0;
    for (int k = i + 1; k < j; k += 2) {
        auto left = countWays(expr, i, k - 1, memo);
        auto right = countWays(expr, k + 1, j, memo);
        long lt = left.first, lf = left.second, rt = right.first, rf = right.second;
        if (expr[k] == '&') { totalTrue += lt * rt; totalFalse += lt*rf + lf*rt + lf*rf; }
        else if (expr[k] == '|') { totalTrue += lt*rt + lt*rf + lf*rt; totalFalse += lf * rf; }
        else { totalTrue += lt*rf + lf*rt; totalFalse += lt*rt + lf*rf; } // XOR
    }
    return memo[i][j] = { totalTrue, totalFalse };
}`,
        variations: [],
        gotchas: ["Tracking BOTH the true-count and false-count at every range (not just one) is required — the false-count of a sub-range often feeds directly into the true-count of a bigger range through AND/OR/XOR."]
      },
      {
        name: "Palindrome Partitioning II (minimum cuts)",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/palindrome-partitioning-ii/",
        idea: "dp[i] is the minimum cuts needed to partition the prefix ending at i into all-palindrome pieces. For each i, try every possible LAST piece (from some start j to i) — if that piece is itself a palindrome, dp[i] could be dp[j-1] + 1. Precomputing which substrings are palindromes with a separate table first avoids re-checking the same substring over and over.",
        time: "O(n²)", space: "O(n²) for the palindrome table",
        code: `int minCut(string s) {
    int n = s.size();
    vector<vector<bool>> isPalin(n, vector<bool>(n, false));
    for (int i = 0; i < n; i++) isPalin[i][i] = true;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j] && (len == 2 || isPalin[i+1][j-1])) isPalin[i][j] = true;
        }
    }
    vector<int> dp(n, 0);
    for (int i = 0; i < n; i++) {
        if (isPalin[0][i]) { dp[i] = 0; continue; }
        dp[i] = i; // worst case: cut before every single character
        for (int j = 1; j <= i; j++) {
            if (isPalin[j][i]) dp[i] = min(dp[i], dp[j-1] + 1);
        }
    }
    return dp[n-1];
}`,
        variations: [],
        gotchas: ["Precomputing the palindrome table first turns an O(n³) brute force into O(n²) overall — checking palindromes on the fly inside the cuts loop is the slow version."]
      },
      {
        name: "Partition Array for Maximum Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/partition-array-for-maximum-sum/",
        idea: "dp[i] is the best achievable total for the prefix ending at i, where every partition has length at most k. Try every possible LAST partition length (from 1 up to k), replacing every element in that final chunk with the chunk's maximum value, and add that to whatever dp said was best before this chunk started.",
        time: "O(n·k)", space: "O(n)",
        code: `int maxSumAfterPartitioning(vector<int>& arr, int k) {
    int n = arr.size();
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        int curMax = 0;
        for (int len = 1; len <= k && len <= i; len++) {
            curMax = max(curMax, arr[i - len]);
            dp[i] = max(dp[i], dp[i - len] + curMax * len);
        }
    }
    return dp[n];
}`,
        variations: [],
        gotchas: ["Track the running max of the current candidate chunk incrementally (rather than recomputing it from scratch each time) — that's what keeps this at O(n·k) instead of O(n·k²)."]
      }
    ]
  },

  {
    id: "dp-squares",
    name: "DP on Squares",
    color: "#8d6e63",
    icon: "dp-squares",
    trigger: "A binary grid, and you need the largest all-1s square (or want to count them)",
    summary: "dp[i][j] is the side length of the largest all-1s square with its bottom-right corner at (i,j) — and it can only be as big as the smallest of the square possibilities directly above, to the left, and diagonally above-left.",
    problems: [
      {
        name: "Largest Square Sub-matrix with All Ones (Maximal Square)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximal-square/",
        idea: "If cell (i,j) is a 1, the largest square ending there can extend the smallest of the three squares ending at its top, left, and top-left neighbors by exactly one more ring — you can't extend further than whichever of those three is the limiting factor.",
        time: "O(rows · cols)", space: "O(cols) with a rolling row",
        code: `int maximalSquare(vector<vector<char>>& matrix) {
    int rows = matrix.size(), cols = matrix[0].size();
    vector<int> prev(cols + 1, 0), cur(cols + 1, 0);
    int best = 0;
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            if (matrix[i-1][j-1] == '1') {
                cur[j] = 1 + min({prev[j], cur[j-1], prev[j-1]});
                best = max(best, cur[j]);
            } else cur[j] = 0;
        }
        prev = cur;
    }
    return best * best; // problem asks for area, not side length
}`,
        variations: ["Maximal Rectangle (a different technique entirely — solved with a monotonic stack over per-row histograms, see the Stacks & Queues topic)"],
        gotchas: ["Watch for whether the question wants the side length or the AREA (side length squared) — easy to submit the wrong one."]
      },
      {
        name: "Count Square Submatrices with All Ones",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/count-square-submatrices-with-all-ones/",
        idea: "Exact same recurrence as Maximal Square — dp[i][j] is still the side of the largest square ending at (i,j). The extra insight: a square of side L ending at (i,j) also contains exactly one valid square of every smaller side from 1 to L ending at that same corner. So dp[i][j] itself IS the count of squares ending there — just sum dp[i][j] across the whole grid.",
        time: "O(rows · cols)", space: "O(cols)",
        code: `int countSquares(vector<vector<int>>& matrix) {
    int rows = matrix.size(), cols = matrix[0].size();
    vector<int> prev(cols, 0), cur(cols, 0);
    int total = 0;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] == 1) {
                if (i == 0 || j == 0) cur[j] = 1;
                else cur[j] = 1 + min({prev[j], cur[j-1], prev[j-1]});
                total += cur[j];
            } else cur[j] = 0;
        }
        prev = cur;
    }
    return total;
}`,
        variations: [],
        gotchas: ["The realization that 'dp[i][j] already IS the count of squares ending here' (not just the largest side) is what turns this from a new problem into a one-line addition to the Maximal Square code."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "New to DP — what do memoization/tabulation even mean", pattern: "dp-fundamentals" },
  { keyword: "The answer depends only on a few recent positions", pattern: "dp-1d" },
  { keyword: "Moving through a grid, minimizing/maximizing a path", pattern: "dp-grids" },
  { keyword: "Each item usable at most once, hitting a target sum", pattern: "dp-01-knapsack" },
  { keyword: "Each item usable unlimited times — coins, cuts", pattern: "dp-unbounded-knapsack" },
  { keyword: "Comparing or transforming two strings", pattern: "dp-strings" },
  { keyword: "Buy/sell stock with a transaction limit, fee, or cooldown", pattern: "dp-stocks" },
  { keyword: "Longest increasing/divisible/chainable subsequence", pattern: "dp-lis" },
  { keyword: "Best way to split a sequence into nested pieces", pattern: "dp-partition-mcm" },
  { keyword: "Largest or count of all-1s squares in a grid", pattern: "dp-squares" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.dp = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();