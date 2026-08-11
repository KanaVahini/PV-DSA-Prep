// ============================================================
// DSA Graphs — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["graphs"] so
// multiple topic files can coexist without clashing on names.
// ============================================================
(function () {

const TOPIC = {
  id: "graphs",
  title: "Graphs",
  tagline: "Trees are just graphs with no cycles and one way in. Once you drop those two guarantees, you need a whole new toolkit — this is that toolkit."
};

const PATTERNS = [
  {
    id: "graph-basics",
    name: "Graph Basics & Traversal",
    color: "#4fc3f7",
    icon: "graph-basics",
    trigger: "Representing connections between things, walking through every reachable node, or counting separate groups",
    summary: "A graph is just nodes and the edges connecting them — no guarantee of a single root, no guarantee there are no cycles. BFS and DFS are the two ways to visit every reachable node, and almost everything else in this topic builds on one of them.",
    problems: [
      {
        name: "Introduction to Graphs",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/introduction-to-graphs-data-structure-and-algorithm-tutorials/",
        idea: "A graph is a set of nodes (vertices) and connections between them (edges). Edges can be directed (one-way, like a follows relationship) or undirected (two-way, like a friendship), and can carry a weight (a cost/distance) or not. The two common ways to store one: an adjacency MATRIX (an n×n grid where cell [i][j] marks whether an edge exists — simple, but wastes memory on sparse graphs) or an adjacency LIST (each node keeps a list of just its actual neighbors — usually the better default).",
        time: "O(V + E) to build an adjacency list", space: "O(V + E) for an adjacency list, O(V²) for a matrix",
        code: `// Adjacency list for an undirected, unweighted graph with V vertices
vector<vector<int>> adj(V);
void addEdge(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u); // omit this line for a directed graph
}

// Weighted version: store {neighbor, weight} pairs instead
vector<vector<pair<int,int>>> weightedAdj(V);
void addWeightedEdge(int u, int v, int w) {
    weightedAdj[u].push_back({v, w});
    weightedAdj[v].push_back({u, w});
}`,
        variations: [],
        gotchas: ["Default to an adjacency list unless the graph is DENSE (close to every pair of nodes connected) — a matrix wastes a lot of memory checking edges that don't exist."]
      },
      {
        name: "BFS Traversal of a Graph",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
        idea: "Same queue-based level-by-level idea as tree level order traversal, generalized: push the start node, then repeatedly pop a node, visit it, and push every unvisited neighbor. The one addition graphs need that trees didn't: a `visited` set — since graphs can have cycles, without tracking visited nodes you could loop forever.",
        time: "O(V + E)", space: "O(V)",
        code: `vector<int> bfs(int start, vector<vector<int>>& adj) {
    vector<int> order;
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true; // mark visited when PUSHING, not when popping
                q.push(neighbor);
            }
        }
    }
    return order;
}`,
        variations: [],
        gotchas: ["Mark a node visited the moment you push it, not when you pop it — otherwise the same node can get pushed onto the queue multiple times before it's ever processed."]
      },
      {
        name: "DFS Traversal of a Graph",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
        idea: "Go as deep as possible down one path before backtracking, using recursion (or an explicit stack). Same `visited` set requirement as BFS to avoid infinite loops on cycles — the only real difference from BFS is the order nodes get explored in, which matters a lot for problems like cycle detection and topological sort.",
        time: "O(V + E)", space: "O(V) for the visited set, O(V) for the recursion stack in the worst case",
        code: `void dfs(int node, vector<vector<int>>& adj, vector<bool>& visited, vector<int>& order) {
    visited[node] = true;
    order.push_back(node);
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) dfs(neighbor, adj, visited, order);
    }
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Number of Provinces (Connected Components)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/number-of-provinces/",
        idea: "A 'province' is just a connected component — a group of nodes all reachable from each other, with no way to reach nodes in a different group. Loop through every node; whenever you find one that hasn't been visited yet, it must be the start of a NEW component, so run a full BFS/DFS from it (marking everything reachable as visited) and increment your component count.",
        time: "O(V + E)", space: "O(V)",
        code: `int findCircleNum(vector<vector<int>>& isConnected) {
    int n = isConnected.size();
    vector<bool> visited(n, false);
    int provinces = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            provinces++;
            queue<int> q;
            q.push(i);
            visited[i] = true;
            while (!q.empty()) {
                int node = q.front(); q.pop();
                for (int j = 0; j < n; j++) {
                    if (isConnected[node][j] == 1 && !visited[j]) {
                        visited[j] = true;
                        q.push(j);
                    }
                }
            }
        }
    }
    return provinces;
}`,
        variations: [],
        gotchas: ["The outer loop is what catches components that don't include node 0 — a single BFS/DFS call only ever explores ONE component, not the whole graph."]
      }
    ]
  },

  {
    id: "graph-grid-traversal",
    name: "Grid-Based BFS/DFS",
    color: "#9ccc65",
    icon: "graph-grid-traversal",
    trigger: "A 2D grid where you need to flood-fill a region, count connected blobs, or find the shortest distance across cells",
    summary: "A grid is secretly a graph — every cell is a node, and it's connected to its (usually 4) neighboring cells. Everything here is BFS or DFS wearing a grid costume, using (row, col) pairs instead of plain node numbers.",
    problems: [
      {
        name: "Flood Fill Algorithm",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/flood-fill/",
        idea: "This is the 'paint bucket' tool from image editors. Starting from a cell, DFS or BFS outward, recoloring every connected cell that shares the ORIGINAL color, stopping at cells with a different color.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `void dfs(vector<vector<int>>& image, int r, int c, int oldColor, int newColor) {
    if (r < 0 || r >= (int)image.size() || c < 0 || c >= (int)image[0].size()) return;
    if (image[r][c] != oldColor || image[r][c] == newColor) return;
    image[r][c] = newColor;
    dfs(image, r+1, c, oldColor, newColor);
    dfs(image, r-1, c, oldColor, newColor);
    dfs(image, r, c+1, oldColor, newColor);
    dfs(image, r, c-1, oldColor, newColor);
}
vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    if (image[sr][sc] != color) dfs(image, sr, sc, image[sr][sc], color);
    return image;
}`,
        variations: [],
        gotchas: ["Check `oldColor == newColor` before recoloring — if they're the same, the naive version recolors forever without a visited set, since a cell always still matches 'the color it just got painted'."]
      },
      {
        name: "Number of Islands",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/number-of-islands/",
        idea: "Same shape as Number of Provinces — scan every cell, and whenever you find an unvisited '1' (land), that's a new island. Sink the whole island with a BFS/DFS (marking every connected land cell as visited) before continuing the scan, and count how many times you had to start a new sink.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `void sinkIsland(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || r >= (int)grid.size() || c < 0 || c >= (int)grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0'; // mark visited by sinking it
    sinkIsland(grid, r+1, c);
    sinkIsland(grid, r-1, c);
    sinkIsland(grid, r, c+1);
    sinkIsland(grid, r, c-1);
}
int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int r = 0; r < (int)grid.size(); r++) {
        for (int c = 0; c < (int)grid[0].size(); c++) {
            if (grid[r][c] == '1') { count++; sinkIsland(grid, r, c); }
        }
    }
    return count;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Number of Distinct Islands",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/find-number-of-distinct-islands-in-a-boolean-2d-matrix/",
        idea: "Beyond just counting islands, you need to know which ones have the SAME shape. As you DFS each island, record the sequence of moves (up/down/left/right) taken to visit every cell relative to the island's starting cell — that sequence is a 'shape signature'. Two islands with the exact same signature are the same shape (translated), so store signatures in a set and count how many unique ones there are.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `void dfs(vector<vector<int>>& grid, int r, int c, int baseR, int baseC, vector<pair<int,int>>& shape) {
    if (r < 0 || r >= (int)grid.size() || c < 0 || c >= (int)grid[0].size() || grid[r][c] != 1) return;
    grid[r][c] = 0;
    shape.push_back({r - baseR, c - baseC}); // position relative to the island's start
    dfs(grid, r+1, c, baseR, baseC, shape);
    dfs(grid, r-1, c, baseR, baseC, shape);
    dfs(grid, r, c+1, baseR, baseC, shape);
    dfs(grid, r, c-1, baseR, baseC, shape);
}
int numDistinctIslands(vector<vector<int>>& grid) {
    set<vector<pair<int,int>>> shapes;
    for (int r = 0; r < (int)grid.size(); r++) {
        for (int c = 0; c < (int)grid[0].size(); c++) {
            if (grid[r][c] == 1) {
                vector<pair<int,int>> shape;
                dfs(grid, r, c, r, c, shape);
                shapes.insert(shape);
            }
        }
    }
    return shapes.size();
}`,
        variations: [],
        gotchas: ["Recording positions RELATIVE to each island's own starting cell (not absolute grid coordinates) is what makes two islands of the same shape compare equal, regardless of where they sit in the grid."]
      },
      {
        name: "Number of Enclaves",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/number-of-enclaves/",
        idea: "An 'enclave' is a land cell that CAN'T reach the grid's border by walking through land. Flip the usual approach: instead of finding what's enclosed, find what's NOT — start a multi-source BFS/DFS from every land cell touching the border, marking everything reachable from the border as safe. Whatever land is left unmarked afterward is enclosed.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `void dfs(vector<vector<int>>& grid, int r, int c) {
    if (r < 0 || r >= (int)grid.size() || c < 0 || c >= (int)grid[0].size() || grid[r][c] != 1) return;
    grid[r][c] = 0; // sink it — reachable from the border, so not enclosed
    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);
}
int numEnclaves(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    for (int r = 0; r < rows; r++) { dfs(grid, r, 0); dfs(grid, r, cols - 1); }
    for (int c = 0; c < cols; c++) { dfs(grid, 0, c); dfs(grid, rows - 1, c); }
    int count = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == 1) count++;
    return count;
}`,
        variations: [],
        gotchas: ["'Start from the border and mark what's SAFE' is the exact opposite framing of most island problems — recognizing when to flip the approach is the whole trick."]
      },
      {
        name: "Rotting Oranges",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/rotting-oranges/",
        idea: "Every rotten orange spreads to its neighbors simultaneously, one minute at a time — that's a MULTI-SOURCE BFS: push every already-rotten orange into the queue at once (not just one), then process level by level, where each level represents one minute passing. The number of levels processed is the total time; if any fresh orange never gets reached, return -1.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `int orangesRotting(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<int,int>> q;
    int fresh = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) q.push({r, c});
            if (grid[r][c] == 1) fresh++;
        }
    int minutes = 0;
    int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};
    while (!q.empty() && fresh > 0) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            auto [r, c] = q.front(); q.pop();
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    q.push({nr, nc});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}`,
        variations: [],
        gotchas: ["Push ALL initially-rotten oranges into the queue before starting the BFS, not just one — that's what makes the rot spread simultaneously from every source instead of sequentially."]
      },
      {
        name: "Distance of Nearest Cell Having 1",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/distance-nearest-cell-1-binary-matrix/",
        idea: "Same multi-source BFS idea as Rotting Oranges: push every cell that's already a 1 into the queue at once, then BFS outward — the first time BFS reaches any cell is guaranteed to be via the SHORTEST path from the nearest 1, since BFS explores in increasing distance order.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `vector<vector<int>> nearestZeros(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> dist(rows, vector<int>(cols, -1));
    queue<pair<int,int>> q;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == 1) { dist[r][c] = 0; q.push({r, c}); }

    int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
    return dist;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Surrounded Regions",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/surrounded-regions/",
        idea: "An 'O' region only survives if it's NOT connected to the border. Exactly the same 'start from the border, mark what's safe' flip used in Number of Enclaves: run BFS/DFS from every border 'O', marking everything reachable as safe. Afterward, flip every unmarked 'O' to 'X' (surrounded) and restore the marked ones back to 'O'.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `void dfs(vector<vector<char>>& board, int r, int c) {
    if (r < 0 || r >= (int)board.size() || c < 0 || c >= (int)board[0].size() || board[r][c] != 'O') return;
    board[r][c] = '#'; // temporarily mark as safe
    dfs(board, r+1, c); dfs(board, r-1, c); dfs(board, r, c+1); dfs(board, r, c-1);
}
void solve(vector<vector<char>>& board) {
    int rows = board.size(), cols = board[0].size();
    for (int r = 0; r < rows; r++) { dfs(board, r, 0); dfs(board, r, cols - 1); }
    for (int c = 0; c < cols; c++) { dfs(board, 0, c); dfs(board, rows - 1, c); }
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (board[r][c] == 'O') board[r][c] = 'X';       // was never marked safe — surrounded
            else if (board[r][c] == '#') board[r][c] = 'O';  // restore the safe ones
        }
}`,
        variations: [],
        gotchas: ["This is the third problem in a row using the exact same 'flip the search direction, start from the border' idea — once you've seen it twice, the third time should feel automatic."]
      }
    ]
  },

  {
    id: "graph-cycles-bipartite",
    name: "Cycle Detection & Bipartite Check",
    color: "#ff8a65",
    icon: "graph-cycles-bipartite",
    trigger: "\"Does this graph have a cycle?\" or \"can every node be colored with just 2 colors so no edge connects same-colored nodes?\"",
    summary: "Cycle detection needs different logic for directed vs undirected graphs — undirected just needs to avoid walking straight back where you came from, but directed needs to track the current recursion path specifically.",
    problems: [
      {
        name: "Detect Cycle in an Undirected Graph",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/detect-cycle-undirected-graph/",
        idea: "During BFS or DFS, if you ever reach a node that's ALREADY visited, and it's not simply the node you just came from (your immediate parent), you've found a cycle — you reached the same node through two genuinely different paths.",
        time: "O(V + E)", space: "O(V)",
        code: `bool bfsHasCycle(int start, vector<vector<int>>& adj, vector<bool>& visited) {
    queue<pair<int,int>> q; // {node, parent}
    q.push({start, -1});
    visited[start] = true;
    while (!q.empty()) {
        auto [node, parent] = q.front(); q.pop();
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push({neighbor, node});
            } else if (neighbor != parent) {
                return true; // reached an already-visited node that isn't our parent
            }
        }
    }
    return false;
}`,
        variations: [],
        gotchas: ["Skipping just the immediate parent (not the whole visited path) is enough here, specifically because undirected edges are symmetric — walking straight back along the edge you just came from doesn't count as a cycle."]
      },
      {
        name: "Detect Cycle in a Directed Graph",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/course-schedule/",
        idea: "In a directed graph, checking against just the immediate parent isn't enough — you need to track the entire current DFS path (the 'recursion stack'). If DFS reaches a node that's already ON the current path, that's a real cycle. But if it reaches a node that was visited on a DIFFERENT, already-finished path, that's fine — it just means two branches happen to both reach that node, not a cycle.",
        time: "O(V + E)", space: "O(V)",
        code: `bool dfs(int node, vector<vector<int>>& adj, vector<bool>& visited, vector<bool>& inPath) {
    visited[node] = true;
    inPath[node] = true;
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            if (dfs(neighbor, adj, visited, inPath)) return true;
        } else if (inPath[neighbor]) {
            return true; // found a node that's on the CURRENT path — real cycle
        }
    }
    inPath[node] = false; // done exploring this node's branch, remove it from the current path
    return false;
}`,
        variations: [],
        gotchas: ["Clearing `inPath[node]` when backtracking is essential — without it, every visited node looks like it's still 'on the path' forever, and you'll get false cycle detections."]
      },
      {
        name: "Bipartite Graph Check",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/is-graph-bipartite/",
        idea: "A graph is bipartite if every node can be colored one of 2 colors such that no edge connects two same-colored nodes. BFS/DFS from each component, alternating colors as you move to each neighbor — if you ever reach an already-colored neighbor with the SAME color as the current node, the graph can't be 2-colored, so it's not bipartite. (One useful fact: any graph containing an odd-length cycle can never be bipartite.)",
        time: "O(V + E)", space: "O(V)",
        code: `bool isBipartite(vector<vector<int>>& adj, int V) {
    vector<int> color(V, -1);
    for (int start = 0; start < V; start++) {
        if (color[start] != -1) continue;
        queue<int> q;
        q.push(start);
        color[start] = 0;
        while (!q.empty()) {
            int node = q.front(); q.pop();
            for (int neighbor : adj[node]) {
                if (color[neighbor] == -1) {
                    color[neighbor] = 1 - color[node]; // opposite color
                    q.push(neighbor);
                } else if (color[neighbor] == color[node]) {
                    return false; // same color on both ends of an edge
                }
            }
        }
    }
    return true;
}`,
        variations: [],
        gotchas: ["Loop over every node as a potential BFS start (not just node 0) — the graph might have multiple disconnected components, each needing its own check."]
      }
    ]
  },

  {
    id: "graph-topo-sort",
    name: "Topological Sort & DAG Applications",
    color: "#ce93d8",
    icon: "graph-topo-sort",
    trigger: "\"What order should these tasks/courses happen in\" · dependencies that must come before other things · only makes sense on a DAG (directed, acyclic)",
    summary: "A topological order lists nodes so that every directed edge points from something earlier in the list to something later — only possible when the graph has no cycles, which is exactly why 'can this be topologically sorted' and 'does this graph have a cycle' are really the same question asked two ways.",
    problems: [
      {
        name: "Topological Sort (Kahn's Algorithm)",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/topological-sorting-indegree-based-solution/",
        idea: "A node with an in-degree of 0 (nothing points to it) has no unmet dependencies, so it can safely go first. Push all in-degree-0 nodes into a queue; every time you process a node, decrement its neighbors' in-degrees (since this dependency is now satisfied) — any neighbor that drops to 0 becomes newly available and joins the queue. If you can't process all V nodes this way, the graph has a cycle and no valid order exists.",
        time: "O(V + E)", space: "O(V)",
        code: `vector<int> topoSortKahn(int V, vector<vector<int>>& adj) {
    vector<int> inDegree(V, 0);
    for (int u = 0; u < V; u++)
        for (int v : adj[u]) inDegree[v]++;

    queue<int> q;
    for (int i = 0; i < V; i++) if (inDegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int neighbor : adj[node]) {
            if (--inDegree[neighbor] == 0) q.push(neighbor);
        }
    }
    return order.size() == V ? order : vector<int>{}; // empty means a cycle exists
}`,
        variations: ["A DFS-based version also exists: run DFS, and push each node onto a stack only AFTER all its neighbors are done — popping the stack gives the topological order."],
        gotchas: ["Checking `order.size() == V` at the end is what detects a cycle — nodes stuck in a cycle never reach in-degree 0, so they never get added."]
      },
      {
        name: "Course Schedule I (Can You Finish All Courses?)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/course-schedule/",
        idea: "Model 'course B requires course A' as a directed edge A → B. Finishing all courses is possible exactly when this graph has NO cycle — which is exactly the same check Kahn's algorithm already does when it verifies `order.size() == V`.",
        time: "O(V + E)", space: "O(V)",
        code: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    for (auto& p : prerequisites) adj[p[1]].push_back(p[0]); // p[1] must come before p[0]
    vector<int> order = topoSortKahn(numCourses, adj); // reuse the function above
    return (int)order.size() == numCourses;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Course Schedule II (Return the Order)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/course-schedule-ii/",
        idea: "Identical to Course Schedule I, except instead of just returning true/false, return the actual valid order — which Kahn's algorithm already produces as a side effect. If a cycle exists, return an empty array instead.",
        time: "O(V + E)", space: "O(V)",
        code: `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    for (auto& p : prerequisites) adj[p[1]].push_back(p[0]);
    return topoSortKahn(numCourses, adj); // already returns {} on a cycle
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Find Eventual Safe States",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/find-eventual-safe-states/",
        idea: "A node is 'safe' if every path starting from it eventually leads to a dead end (a node with no outgoing edges), never looping into a cycle. The clean trick: reverse every edge, then any node that can reach a true dead-end in the ORIGINAL graph now has in-degree considerations that make it eligible for Kahn's algorithm — running topological sort on the reversed graph naturally identifies exactly the safe nodes.",
        time: "O(V + E)", space: "O(V + E)",
        code: `vector<int> eventualSafeNodes(int n, vector<vector<int>>& graph) {
    vector<vector<int>> radj(n); // reversed graph
    vector<int> outDegree(n, 0);
    for (int u = 0; u < n; u++) {
        for (int v : graph[u]) { radj[v].push_back(u); outDegree[u]++; }
    }
    queue<int> q;
    for (int i = 0; i < n; i++) if (outDegree[i] == 0) q.push(i); // true dead ends first

    vector<bool> safe(n, false);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        safe[node] = true;
        for (int prev : radj[node]) {
            if (--outDegree[prev] == 0) q.push(prev);
        }
    }
    vector<int> result;
    for (int i = 0; i < n; i++) if (safe[i]) result.push_back(i);
    return result;
}`,
        variations: [],
        gotchas: ["Reversing the graph first is the non-obvious step — it turns 'can this node always eventually reach a dead end' into a straightforward Kahn's-algorithm-style in-degree elimination."]
      },
      {
        name: "Alien Dictionary",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/given-sorted-dictionary-find-precedence-alphabet/",
        idea: "Compare each pair of adjacent words in the given sorted list — the FIRST position where they differ tells you one letter comes before another in the alien alphabet (an edge in a graph of letters). Once you've built that graph from all such comparisons, topologically sorting it gives the alien alphabet's order.",
        time: "O(total characters across all words + alphabet size)", space: "O(alphabet size)",
        code: `vector<int> alienOrder(vector<string>& words, int alphabetSize) {
    vector<vector<int>> adj(alphabetSize);
    vector<int> inDegree(alphabetSize, 0);
    vector<bool> edgeExists(alphabetSize * alphabetSize, false);

    for (int i = 0; i + 1 < (int)words.size(); i++) {
        string& a = words[i]; string& b = words[i+1];
        int minLen = min(a.size(), b.size());
        int j = 0;
        for (; j < minLen; j++) {
            if (a[j] != b[j]) {
                int u = a[j] - 'a', v = b[j] - 'a';
                if (!edgeExists[u * alphabetSize + v]) {
                    adj[u].push_back(v);
                    inDegree[v]++;
                    edgeExists[u * alphabetSize + v] = true;
                }
                break;
            }
        }
        // if a is longer than b but b is a prefix of a, the input order is invalid
        if (j == minLen && a.size() > b.size()) return {};
    }
    return topoSortKahn(alphabetSize, adj); // returns {} if a cycle is found (contradiction)
}`,
        variations: [],
        gotchas: ["Only the FIRST differing character between two adjacent words gives you real information — comparing beyond that point doesn't tell you anything new about letter order."]
      },
      {
        name: "Shortest Path in a DAG",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/shortest-path-for-directed-acyclic-graphs/",
        idea: "In a general weighted graph, you'd need Dijkstra's or Bellman-Ford. But a DAG is special: process nodes in TOPOLOGICAL order, and by the time you reach any node, every possible path to it has already been fully explored (since all its predecessors come earlier in the order). That means a single pass — relaxing each node's outgoing edges once, in topo order — is enough to guarantee shortest distances, no repeated relaxation needed.",
        time: "O(V + E)", space: "O(V)",
        code: `vector<int> shortestPathDAG(int V, vector<vector<pair<int,int>>>& adj) {
    // adj[u] contains {v, weight} pairs
    vector<vector<int>> plainAdj(V);
    for (int u = 0; u < V; u++) for (auto& [v, w] : adj[u]) plainAdj[u].push_back(v);
    vector<int> topoOrder = topoSortKahn(V, plainAdj);

    vector<int> dist(V, INT_MAX);
    dist[topoOrder[0]] = 0; // assumes topoOrder[0] is the source; adjust if source is fixed
    for (int u : topoOrder) {
        if (dist[u] == INT_MAX) continue;
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }
    }
    return dist;
}`,
        variations: [],
        gotchas: ["This ONLY works because the graph is acyclic — with a cycle, 'process each node once in some fixed order' can't guarantee correctness, since a node might need updating after a later node is already processed."]
      }
    ]
  },

  {
    id: "graph-shortest-path",
    name: "Shortest Path Algorithms",
    color: "#ffca28",
    icon: "graph-shortest-path",
    trigger: "Weighted edges, and you need the cheapest/shortest way from one node to another (or to everywhere)",
    summary: "Unweighted graphs use plain BFS. Weighted graphs with only non-negative edges use Dijkstra's. Graphs that might have negative edges need Bellman-Ford. Needing every pair's shortest distance at once calls for Floyd-Warshall.",
    problems: [
      {
        name: "Dijkstra's Algorithm",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/network-delay-time/",
        idea: "Greedily expand outward from the source, always processing whichever known-but-unfinalized node currently has the SMALLEST distance — a min-heap (priority queue) keeps that lookup fast. Once a node is popped from the heap with its finalized distance, that distance can never improve later, because every other candidate path is already at least as long (this greedy guarantee is exactly why Dijkstra's breaks on negative edge weights).",
        time: "O((V + E) log V)", space: "O(V)",
        code: `vector<int> dijkstra(int V, vector<vector<pair<int,int>>>& adj, int src) {
    vector<int> dist(V, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq; // {distance, node}
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, node] = pq.top(); pq.pop();
        if (d > dist[node]) continue; // a shorter path was already found — stale entry
        for (auto& [neighbor, weight] : adj[node]) {
            if (d + weight < dist[neighbor]) {
                dist[neighbor] = d + weight;
                pq.push({dist[neighbor], neighbor});
            }
        }
    }
    return dist;
}`,
        variations: [],
        gotchas: ["Skipping 'stale' heap entries (`if (d > dist[node]) continue;`) is necessary because the same node can be pushed multiple times with different distances — only the most recent, smallest one matters."]
      },
      {
        name: "Print Shortest Path (Dijkstra + Parent Tracking)",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/printing-paths-in-dijkstras-shortest-path-algorithm/",
        idea: "Run Dijkstra's exactly as normal, but every time you relax an edge (find a genuinely better path to a node), also record WHO you came from — a `parent` array. Once distances are finalized, reconstruct the actual path by walking backward through `parent` from the destination to the source, then reverse it.",
        time: "O((V + E) log V)", space: "O(V)",
        code: `vector<int> dijkstraWithPath(int V, vector<vector<pair<int,int>>>& adj, int src, int dest) {
    vector<int> dist(V, INT_MAX), parent(V);
    for (int i = 0; i < V; i++) parent[i] = i; // initially, everyone is their own parent
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, node] = pq.top(); pq.pop();
        if (d > dist[node]) continue;
        for (auto& [neighbor, weight] : adj[node]) {
            if (d + weight < dist[neighbor]) {
                dist[neighbor] = d + weight;
                parent[neighbor] = node;
                pq.push({dist[neighbor], neighbor});
            }
        }
    }
    if (dist[dest] == INT_MAX) return {}; // unreachable
    vector<int> path;
    for (int at = dest; at != parent[at]; at = parent[at]) path.push_back(at);
    path.push_back(src);
    reverse(path.begin(), path.end());
    return path;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Shortest Path in an Undirected Graph with Unit Weights",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/shortest-path-in-an-unweighted-graph/",
        idea: "When every edge has the same weight (or no weight at all), Dijkstra's is overkill — plain BFS already finds shortest paths, since BFS naturally explores nodes in increasing order of edge-count from the source. No heap needed at all.",
        time: "O(V + E)", space: "O(V)",
        code: `vector<int> shortestPathUnitWeights(int V, vector<vector<int>>& adj, int src) {
    vector<int> dist(V, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        for (int neighbor : adj[node]) {
            if (dist[neighbor] == -1) {
                dist[neighbor] = dist[node] + 1;
                q.push(neighbor);
            }
        }
    }
    return dist;
}`,
        variations: [],
        gotchas: ["Reaching for Dijkstra's here isn't WRONG, just needlessly slower — recognizing 'all weights equal' as a signal for plain BFS is a good habit to build."]
      },
      {
        name: "Shortest Distance in a Binary Maze",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
        idea: "A grid maze where every step costs the same is exactly the 'unit weights' case above — BFS from the source cell, treating each open neighboring cell as a graph edge, gives the shortest number of steps to any reachable cell.",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    int n = grid.size();
    if (grid[0][0] != 0 || grid[n-1][n-1] != 0) return -1;
    vector<vector<int>> dist(n, vector<int>(n, -1));
    queue<pair<int,int>> q;
    dist[0][0] = 1;
    q.push({0, 0});
    int dr[] = {-1,-1,-1,0,0,1,1,1}, dc[] = {-1,0,1,-1,1,-1,0,1}; // 8 directions
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        if (r == n-1 && c == n-1) return dist[r][c];
        for (int d = 0; d < 8; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0 && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
    return -1;
}`,
        variations: [],
        gotchas: ["This particular maze allows 8-directional movement (including diagonals), not just 4 — double check the problem's movement rules before copying a 4-direction template."]
      },
      {
        name: "Path With Minimum Effort",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/path-with-minimum-effort/",
        idea: "The 'cost' of a path isn't the sum of its steps — it's the SINGLE BIGGEST height difference along the way. That's not a normal sum-based Dijkstra's, but the same greedy priority-queue structure still works: instead of tracking accumulated distance, track the maximum step-difference seen so far on each path, and always expand whichever path currently has the smallest such maximum.",
        time: "O((rows · cols) log(rows · cols))", space: "O(rows · cols)",
        code: `int minimumEffortPath(vector<vector<int>>& heights) {
    int rows = heights.size(), cols = heights[0].size();
    vector<vector<int>> effort(rows, vector<int>(cols, INT_MAX));
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq; // {effort, r, c}
    effort[0][0] = 0;
    pq.push({0, 0, 0});
    int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};
    while (!pq.empty()) {
        auto [e, r, c] = pq.top(); pq.pop();
        if (r == rows-1 && c == cols-1) return e;
        if (e > effort[r][c]) continue;
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                int newEffort = max(e, abs(heights[nr][nc] - heights[r][c]));
                if (newEffort < effort[nr][nc]) {
                    effort[nr][nc] = newEffort;
                    pq.push({newEffort, nr, nc});
                }
            }
        }
    }
    return 0;
}`,
        variations: [],
        gotchas: ["The 'distance' being minimized is `max(current effort, this step's height difference)`, not a running sum — swapping in a sum by habit is the most common mistake here."]
      },
      {
        name: "Cheapest Flights Within K Stops",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        idea: "Plain Dijkstra's doesn't track how many EDGES a path has used, only its total cost — so it can't enforce a stop limit. Instead, do a Bellman-Ford-style relaxation restricted to exactly K+1 rounds: each round, relax every edge using distances from the PREVIOUS round only (a snapshot), guaranteeing each round adds exactly one more allowed flight.",
        time: "O(K · E)", space: "O(V)",
        code: `int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        vector<int> temp = dist; // snapshot — relax using only last round's distances
        for (auto& f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (dist[u] != INT_MAX && dist[u] + w < temp[v]) {
                temp[v] = dist[u] + w;
            }
        }
        dist = temp;
    }
    return dist[dst] == INT_MAX ? -1 : dist[dst];
}`,
        variations: [],
        gotchas: ["Using a fresh snapshot (`temp`) each round instead of updating `dist` in place is essential — updating in place would let a single round accidentally use multiple flights' worth of relaxation."]
      },
      {
        name: "Bellman-Ford Algorithm",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/network-delay-time/",
        idea: "Dijkstra's greedy 'always expand the smallest known distance' breaks when edges can be negative, since a longer-looking path might later reveal a big negative shortcut. Bellman-Ford's fix: relax EVERY edge, V-1 times total (V-1 because that's the longest a shortest path could possibly be, in edges, without repeating a node). If a valid V-th round still finds an improvement, that proves a negative-weight cycle exists.",
        time: "O(V · E)", space: "O(V)",
        code: `vector<int> bellmanFord(int V, vector<vector<int>>& edges, int src) {
    vector<int> dist(V, INT_MAX);
    dist[src] = 0;
    for (int i = 0; i < V - 1; i++) {
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }
    }
    // one more round: if anything still improves, there's a negative cycle
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) return {}; // negative cycle detected
    }
    return dist;
}`,
        variations: [],
        gotchas: ["Bellman-Ford is the algorithm to reach for the moment negative edge weights are even POSSIBLE — Dijkstra's can silently give wrong answers on such graphs instead of erroring out."]
      },
      {
        name: "Floyd-Warshall Algorithm",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
        idea: "When you need shortest distances between EVERY pair of nodes at once (not just from one source), running Dijkstra's V separate times works, but Floyd-Warshall is often simpler to write: for every possible 'via' node k, check if routing through k improves the direct distance between every pair (i, j). Three nested loops, and the outermost one (k) MUST be the outer loop — that ordering is what makes each pass build correctly on the previous one.",
        time: "O(V³)", space: "O(V²)",
        code: `void floydWarshall(vector<vector<int>>& dist) { // dist[i][j] pre-filled with direct edges, INF otherwise
    int V = dist.size();
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] < INT_MAX && dist[k][j] < INT_MAX)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
}
// Find the City With the Smallest Number of Neighbors at a Threshold Distance:
// run floydWarshall on the full distance matrix, then for each city count how many
// other cities are reachable within the threshold — return the city with the fewest
// (breaking ties by preferring the city with the larger index)`,
        variations: ["Find the City With the Smallest Number of Neighbors at a Threshold Distance (a direct application — run Floyd-Warshall, then count reachable neighbors per city)"],
        gotchas: ["The `k` loop must be OUTERMOST — putting it in a different position breaks the algorithm's correctness, since later iterations depend on `k` having already been fully processed as an intermediate node for all pairs."]
      },
      {
        name: "Number of Ways to Arrive at Destination",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",
        idea: "Run Dijkstra's as normal, but track a SECOND array counting how many distinct shortest paths reach each node. When relaxing an edge finds a strictly BETTER distance, reset that neighbor's path count to match the current node's count. When it finds a path of EQUAL length to the current best, ADD the current node's count to the neighbor's — another equally-short way to get there.",
        time: "O((V + E) log V)", space: "O(V)",
        code: `int countPaths(int n, vector<vector<int>>& roads) {
    const int MOD = 1e9 + 7;
    vector<vector<pair<int,long>>> adj(n);
    for (auto& r : roads) {
        adj[r[0]].push_back({r[1], r[2]});
        adj[r[1]].push_back({r[0], r[2]});
    }
    vector<long> dist(n, LONG_MAX), ways(n, 0);
    priority_queue<pair<long,int>, vector<pair<long,int>>, greater<>> pq;
    dist[0] = 0; ways[0] = 1;
    pq.push({0, 0});
    while (!pq.empty()) {
        auto [d, node] = pq.top(); pq.pop();
        if (d > dist[node]) continue;
        for (auto& [neighbor, weight] : adj[node]) {
            if (d + weight < dist[neighbor]) {
                dist[neighbor] = d + weight;
                ways[neighbor] = ways[node];
                pq.push({dist[neighbor], neighbor});
            } else if (d + weight == dist[neighbor]) {
                ways[neighbor] = (ways[neighbor] + ways[node]) % MOD;
            }
        }
    }
    return ways[n-1];
}`,
        variations: [],
        gotchas: ["The equal-distance case (accumulating ways) is easy to miss if you only think about the 'strictly better' case — both branches are required."]
      }
    ]
  },

  {
    id: "implicit-graph-bfs",
    name: "Implicit Graphs & BFS on States",
    color: "#4db6ac",
    icon: "implicit-graph-bfs",
    trigger: "There's no explicit graph given — but the 'states' you can move between (numbers, words) form one anyway",
    summary: "Sometimes the graph isn't handed to you as nodes and edges — it's hiding inside a set of allowed moves between values or words. Recognizing 'this is just BFS on an implicit graph' is the whole skill.",
    problems: [
      {
        name: "Minimum Multiplications to Reach End",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/minimum-multiplications-to-reach-end/",
        idea: "Each number from 0 to 99999 is a 'node', and multiplying by any value in the given list and taking mod 100000 is an 'edge' to another such node. BFS from the start value — since every edge effectively costs 1 multiplication, BFS's level-by-level exploration finds the minimum number of multiplications the same way it finds the shortest path in any unit-weight graph.",
        time: "O(100000 · size of multiplier list)", space: "O(100000)",
        code: `int minimumMultiplications(vector<int>& arr, int start, int end) {
    const int MOD = 100000;
    vector<int> dist(MOD, -1);
    queue<int> q;
    dist[start] = 0;
    q.push(start);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        if (node == end) return dist[node];
        for (int x : arr) {
            int next = (int)(((long)node * x) % MOD);
            if (dist[next] == -1) {
                dist[next] = dist[node] + 1;
                q.push(next);
            }
        }
    }
    return -1;
}`,
        variations: [],
        gotchas: ["The 'graph' here has exactly 100000 possible nodes (every value mod 100000) — recognizing that bound is what makes a BFS over an otherwise unbounded multiplication sequence actually finite and tractable."]
      },
      {
        name: "Word Ladder I",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/word-ladder/",
        idea: "Words are nodes; an edge connects two words that differ by exactly one letter. BFS from the start word toward the end word — since each transformation costs 1 step, BFS naturally finds the shortest transformation sequence, same as any unit-weight shortest path.",
        time: "O(words · word length² ) roughly, generating and checking neighbors", space: "O(words · word length)",
        code: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> dict(wordList.begin(), wordList.end());
    if (!dict.count(endWord)) return 0;
    queue<pair<string,int>> q;
    q.push({beginWord, 1});
    dict.erase(beginWord);
    while (!q.empty()) {
        auto [word, steps] = q.front(); q.pop();
        if (word == endWord) return steps;
        for (int i = 0; i < (int)word.size(); i++) {
            string temp = word;
            for (char c = 'a'; c <= 'z'; c++) {
                temp[i] = c;
                if (dict.count(temp)) {
                    dict.erase(temp); // erase = mark visited, avoids revisiting
                    q.push({temp, steps + 1});
                }
            }
        }
    }
    return 0;
}`,
        variations: [],
        gotchas: ["Erasing a word from the dictionary the moment it's queued (instead of using a separate visited set) doubles as both 'mark visited' and 'prevent revisiting' in one step."]
      },
      {
        name: "Word Ladder II",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/word-ladder-ii/",
        idea: "Same graph-of-words idea as Word Ladder I, but now you need ALL shortest transformation sequences, not just the length of one. First BFS layer by layer to find the shortest distance to every reachable word, WITHOUT erasing words within the same layer (so multiple parents at the same distance can all be recorded). Then walk that layered structure backward from the end word, reconstructing every path that decreases in distance by exactly 1 at each step.",
        time: "O(words · word length² ) for the BFS, plus path reconstruction", space: "O(words · word length)",
        code: `vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> dict(wordList.begin(), wordList.end());
    vector<vector<string>> result;
    if (!dict.count(endWord)) return result;

    unordered_map<string, vector<string>> parents;
    unordered_set<string> currentLevel{beginWord};
    dict.erase(beginWord);
    bool found = false;

    while (!currentLevel.empty() && !found) {
        unordered_set<string> nextLevel;
        unordered_set<string> toErase;
        for (const string& word : currentLevel) {
            string temp = word;
            for (int i = 0; i < (int)word.size(); i++) {
                char original = temp[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    temp[i] = c;
                    if (dict.count(temp)) {
                        nextLevel.insert(temp);
                        toErase.insert(temp);
                        parents[temp].push_back(word);
                        if (temp == endWord) found = true;
                    }
                }
                temp[i] = original;
            }
        }
        for (const string& w : toErase) dict.erase(w); // erase only AFTER the full level is processed
        currentLevel = nextLevel;
    }

    if (!found) return result;
    vector<string> path{endWord};
    function<void(string&)> backtrack = [&](string& word) {
        if (word == beginWord) { result.push_back(vector<string>(path.rbegin(), path.rend())); return; }
        for (string& p : parents[word]) {
            path.push_back(p);
            backtrack(p);
            path.pop_back();
        }
    };
    backtrack(endWord);
    return result;
}`,
        variations: [],
        gotchas: ["Erasing visited words only AFTER the entire current level finishes processing (not immediately) is critical — erasing too early can cut off other valid same-length paths through those words."]
      }
    ]
  },

  {
    id: "graph-mst-dsu",
    name: "Minimum Spanning Tree & Disjoint Set",
    color: "#7986cb",
    icon: "graph-mst-dsu",
    trigger: "Connecting everything as cheaply as possible with no cycles · repeatedly asking \"are these two things already connected?\"",
    summary: "A minimum spanning tree connects every node using the fewest total edge weight, with no cycles. The Disjoint Set (Union-Find) structure that helps build one turns out to be independently useful anytime you need fast 'are these connected?' queries.",
    problems: [
      {
        name: "Disjoint Set (Union-Find)",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/",
        idea: "Each element starts as its own separate group. `find(x)` walks up to the 'representative' of x's group; `union(x, y)` merges the two groups those elements belong to. Two optimizations make both operations nearly O(1) on average: PATH COMPRESSION (while finding a representative, point every node along the way directly at it, flattening future lookups) and UNION BY RANK/SIZE (always attach the smaller tree under the bigger one's root, keeping trees shallow).",
        time: "O(α(n)) per operation — practically constant", space: "O(n)",
        code: `class DisjointSet {
    vector<int> parent, rank_;
public:
    DisjointSet(int n) {
        parent.resize(n);
        rank_.assign(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // path compression
        return parent[x];
    }
    void unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;
        if (rank_[rx] < rank_[ry]) swap(rx, ry);
        parent[ry] = rx;                 // attach smaller-rank tree under bigger one
        if (rank_[rx] == rank_[ry]) rank_[rx]++;
    }
};`,
        variations: [],
        gotchas: ["Without BOTH optimizations, the tree can degrade into a long chain, making `find` slow — path compression alone or union by rank alone still helps, but combining them is what gives the near-constant-time guarantee."]
      },
      {
        name: "Minimum Spanning Tree — Prim's Algorithm",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/prims-minimum-spanning-tree-mst-greedy-algo-5/",
        idea: "Grow the spanning tree one node at a time, always adding whichever EDGE connects a node already in the tree to a node not yet in the tree, at the cheapest cost — a min-heap of {weight, node} makes finding that cheapest edge fast. This looks almost identical to Dijkstra's, but tracks the cheapest edge INTO each node rather than the cheapest total distance from the source.",
        time: "O(E log V)", space: "O(V)",
        code: `int primsMST(int V, vector<vector<pair<int,int>>>& adj) {
    vector<bool> inMST(V, false);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq; // {weight, node}
    pq.push({0, 0});
    int totalWeight = 0;
    while (!pq.empty()) {
        auto [weight, node] = pq.top(); pq.pop();
        if (inMST[node]) continue;
        inMST[node] = true;
        totalWeight += weight;
        for (auto& [neighbor, w] : adj[node]) {
            if (!inMST[neighbor]) pq.push({w, neighbor});
        }
    }
    return totalWeight;
}`,
        variations: [],
        gotchas: ["Prim's tends to be the more natural choice when the graph is DENSE (lots of edges) — Kruskal's usually edges it out on sparse graphs, since it works from a sorted edge list instead."]
      },
      {
        name: "Minimum Spanning Tree — Kruskal's Algorithm",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/",
        idea: "Sort every edge by weight, cheapest first. Walk through them in that order, adding an edge to the MST only if its two endpoints AREN'T already connected (checked with Disjoint Set's `find`) — adding an edge between already-connected nodes would create a cycle, which a spanning tree can't have. Stop once V-1 edges have been added.",
        time: "O(E log E) for the sort, plus near-O(E) for the union-find operations", space: "O(V + E)",
        code: `int kruskalsMST(int V, vector<vector<int>>& edges) { // edges are {weight, u, v}
    sort(edges.begin(), edges.end());
    DisjointSet ds(V);
    int totalWeight = 0, edgesUsed = 0;
    for (auto& e : edges) {
        int weight = e[0], u = e[1], v = e[2];
        if (ds.find(u) != ds.find(v)) {
            ds.unite(u, v);
            totalWeight += weight;
            edgesUsed++;
            if (edgesUsed == V - 1) break; // spanning tree complete
        }
    }
    return totalWeight;
}`,
        variations: [],
        gotchas: ["The 'skip this edge if it would create a cycle' check — via `find(u) != find(v)` — is the entire reason Kruskal's needs Disjoint Set in the first place."]
      },
      {
        name: "Number of Operations to Make Network Connected",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
        idea: "Union every pair of directly-connected computers using Disjoint Set. Afterward, count how many separate components remain (call it C) — you need exactly C-1 cables to connect them all into one network. But you also need to check you HAVE at least C-1 spare (redundant) cables available to use, otherwise it's impossible.",
        time: "O(edges · α(n))", space: "O(n)",
        code: `int makeConnected(int n, vector<vector<int>>& connections) {
    if ((int)connections.size() < n - 1) return -1; // not enough cables to possibly connect everyone
    DisjointSet ds(n);
    for (auto& c : connections) ds.unite(c[0], c[1]);
    unordered_set<int> roots;
    for (int i = 0; i < n; i++) roots.insert(ds.find(i));
    return roots.size() - 1;
}`,
        variations: [],
        gotchas: ["Checking `connections.size() < n - 1` upfront catches the impossible case immediately — a spanning tree over n nodes needs at least n-1 edges to exist at all."]
      },
      {
        name: "Accounts Merge",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/accounts-merge/",
        idea: "Two accounts belong to the same person if they share at least one email. Treat each ACCOUNT as a Disjoint Set element; for every email, if it's already been seen under a different account, union those two accounts together. After processing everyone, each remaining group of unioned accounts represents one real person — collect and merge their emails.",
        time: "O(total emails · α(accounts))", space: "O(total emails)",
        code: `vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    int n = accounts.size();
    DisjointSet ds(n);
    unordered_map<string, int> emailToAccount;
    for (int i = 0; i < n; i++) {
        for (int j = 1; j < (int)accounts[i].size(); j++) {
            string& email = accounts[i][j];
            if (emailToAccount.count(email)) ds.unite(i, emailToAccount[email]);
            else emailToAccount[email] = i;
        }
    }
    unordered_map<int, set<string>> merged;
    for (auto& [email, acc] : emailToAccount) merged[ds.find(acc)].insert(email);

    vector<vector<string>> result;
    for (auto& [root, emails] : merged) {
        vector<string> entry{accounts[root][0]};
        entry.insert(entry.end(), emails.begin(), emails.end());
        result.push_back(entry);
    }
    return result;
}`,
        variations: [],
        gotchas: ["Using a `set<string>` for each merged group's emails gets you sorted, de-duplicated output for free — a plain vector would need manual sorting and dedup afterward."]
      },
      {
        name: "Number of Islands II (Online Queries)",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/number-of-islands-ii-with-explanation/",
        idea: "Land cells get ADDED one at a time (not all present upfront), and you need the island count after EACH addition — recomputing from scratch every time would be far too slow. Use Disjoint Set instead: when a new land cell appears, start it as its own island (count++), then union it with any already-land neighbors (each successful union merges two islands into one, so count--).",
        time: "O(queries · α(rows·cols))", space: "O(rows · cols)",
        code: `vector<int> numIslands2(int rows, int cols, vector<vector<int>>& positions) {
    DisjointSet ds(rows * cols);
    vector<bool> isLand(rows * cols, false);
    vector<int> result;
    int islandCount = 0;
    int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};
    for (auto& pos : positions) {
        int r = pos[0], c = pos[1], idx = r * cols + c;
        if (isLand[idx]) { result.push_back(islandCount); continue; } // duplicate query
        isLand[idx] = true;
        islandCount++;
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && isLand[nr*cols+nc]) {
                if (ds.find(idx) != ds.find(nr*cols+nc)) {
                    ds.unite(idx, nr*cols+nc);
                    islandCount--;
                }
            }
        }
        result.push_back(islandCount);
    }
    return result;
}`,
        variations: [],
        gotchas: ["Only decrement the count when the union ACTUALLY merges two different components (`find(idx) != find(neighbor)`) — unioning two cells already in the same island shouldn't double-subtract."]
      },
      {
        name: "Making a Large Island",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/making-a-large-island/",
        idea: "First, label every existing island with a unique ID and record each island's size (via DFS/BFS or Disjoint Set). Then, for every single water cell, imagine flipping it to land — the resulting island's size would be 1 plus the sizes of every DISTINCT island touching that cell. Try this for every water cell and take the best result (if the whole grid is already land, the answer is just its total size).",
        time: "O(rows · cols)", space: "O(rows · cols)",
        code: `int largestIsland(vector<vector<int>>& grid) {
    int n = grid.size();
    vector<vector<int>> id(n, vector<int>(n, -1));
    unordered_map<int, int> sizeOf;
    int islandId = 0;

    function<int(int,int,int)> dfs = [&](int r, int c, int curId) -> int {
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] != 1 || id[r][c] != -1) return 0;
        id[r][c] = curId;
        return 1 + dfs(r+1,c,curId) + dfs(r-1,c,curId) + dfs(r,c+1,curId) + dfs(r,c-1,curId);
    };
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++)
            if (grid[r][c] == 1 && id[r][c] == -1) sizeOf[islandId] = dfs(r, c, islandId), islandId++;

    int best = 0;
    for (auto& [k, s] : sizeOf) best = max(best, s); // in case the grid is already all land
    int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] != 0) continue;
            unordered_set<int> neighborIslands;
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && id[nr][nc] != -1) neighborIslands.insert(id[nr][nc]);
            }
            int total = 1;
            for (int nid : neighborIslands) total += sizeOf[nid];
            best = max(best, total);
        }
    }
    return best;
}`,
        variations: [],
        gotchas: ["Using a set for `neighborIslands` is what prevents double-counting when a water cell touches the SAME island from two different directions (e.g. a U-shaped island wrapping around it)."]
      },
      {
        name: "Most Stones Removed with Same Row or Column",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/most-stones-removed-with-same-row-and-column/",
        idea: "Stones sharing a row or column are connected — union every stone with others in the same row and same column (using row/column indices offset into a shared ID space to keep them in one Disjoint Set). Within any connected component of stones, every stone but one can be removed while still leaving the last one behind. So the answer is simply (total stones) minus (number of distinct connected components).",
        time: "O(stones · α(stones))", space: "O(stones)",
        code: `int removeStones(vector<vector<int>>& stones) {
    int n = stones.size();
    DisjointSet ds(20005); // rows and columns share the ID space; columns offset by +10001
    for (auto& s : stones) ds.unite(s[0], s[1] + 10001);

    unordered_set<int> roots;
    for (auto& s : stones) roots.insert(ds.find(s[0]));
    return n - roots.size();
}`,
        variations: [],
        gotchas: ["Rows and columns must be pushed into DIFFERENT numeric ranges (the `+10001` offset) before union-ing — otherwise a row index and a column index with the same number would incorrectly get treated as the same node."]
      }
    ]
  },

  {
    id: "graph-scc-bridges",
    name: "Strongly Connected Components, Bridges & Articulation Points",
    color: "#e57373",
    icon: "graph-scc-bridges",
    trigger: "Which nodes can all reach each other in a directed graph · which single edge or node, if removed, would break the graph apart",
    summary: "These all lean on DFS's 'discovery time' and 'low-link value' — tracking, for each node, the earliest-discovered node reachable from it via any combination of tree edges and at most one back-edge.",
    problems: [
      {
        name: "Kosaraju's Algorithm (Strongly Connected Components)",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/strongly-connected-components/",
        idea: "A strongly connected component (SCC) is a group of nodes that can all reach EACH OTHER via directed edges. Kosaraju's does this in 3 clean steps: (1) DFS the graph, pushing each node onto a stack as it finishes (like building a topological-ish order); (2) reverse every edge in the graph; (3) pop nodes off the stack one at a time, and for each unvisited one, DFS the REVERSED graph from it — everything reached in that DFS is one full SCC.",
        time: "O(V + E)", space: "O(V + E)",
        code: `void fillOrder(int node, vector<vector<int>>& adj, vector<bool>& visited, stack<int>& order) {
    visited[node] = true;
    for (int neighbor : adj[node]) if (!visited[neighbor]) fillOrder(neighbor, adj, visited, order);
    order.push(node);
}
void dfsCollect(int node, vector<vector<int>>& radj, vector<bool>& visited, vector<int>& component) {
    visited[node] = true;
    component.push_back(node);
    for (int neighbor : radj[node]) if (!visited[neighbor]) dfsCollect(neighbor, radj, visited, component);
}
vector<vector<int>> kosaraju(int V, vector<vector<int>>& adj) {
    vector<bool> visited(V, false);
    stack<int> order;
    for (int i = 0; i < V; i++) if (!visited[i]) fillOrder(i, adj, visited, order);

    vector<vector<int>> radj(V);
    for (int u = 0; u < V; u++) for (int v : adj[u]) radj[v].push_back(u);

    fill(visited.begin(), visited.end(), false);
    vector<vector<int>> sccs;
    while (!order.empty()) {
        int node = order.top(); order.pop();
        if (!visited[node]) {
            vector<int> component;
            dfsCollect(node, radj, visited, component);
            sccs.push_back(component);
        }
    }
    return sccs;
}`,
        variations: [],
        gotchas: ["All three steps are required in order — skipping the reversal, or popping the stack in the wrong order, silently produces incorrect groupings instead of an obvious error."]
      },
      {
        name: "Bridges in a Graph (Tarjan's Algorithm)",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/critical-connections-in-a-network/",
        idea: "A bridge is an edge that, if removed, disconnects the graph. During DFS, track each node's discovery time and its 'low' value (the earliest discovery time reachable from it, including through one back-edge to an ancestor). An edge (u, v) is a bridge exactly when v's low value is STRICTLY GREATER than u's discovery time — meaning v (and everything below it) has no back-edge reaching back up to u or higher, so that edge is the only thing holding them together.",
        time: "O(V + E)", space: "O(V)",
        code: `void dfs(int node, int parent, int& timer, vector<int>& disc, vector<int>& low,
         vector<vector<int>>& adj, vector<vector<int>>& bridges) {
    disc[node] = low[node] = timer++;
    for (int neighbor : adj[node]) {
        if (neighbor == parent) continue;
        if (disc[neighbor] == -1) {
            dfs(neighbor, node, timer, disc, low, adj, bridges);
            low[node] = min(low[node], low[neighbor]);
            if (low[neighbor] > disc[node]) bridges.push_back({node, neighbor});
        } else {
            low[node] = min(low[node], disc[neighbor]); // back-edge
        }
    }
}
vector<vector<int>> findBridges(int V, vector<vector<int>>& adj) {
    vector<int> disc(V, -1), low(V, -1);
    vector<vector<int>> bridges;
    int timer = 0;
    for (int i = 0; i < V; i++) if (disc[i] == -1) dfs(i, -1, timer, disc, low, adj, bridges);
    return bridges;
}`,
        variations: [],
        gotchas: ["Skip only the DIRECT parent edge (via a parent variable), not every previously-visited node — with multi-edges between the same two nodes, blindly ignoring all visited neighbors could hide a genuine back-edge."]
      },
      {
        name: "Articulation Points in a Graph",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/articulation-points-or-cut-vertices-in-a-graph/",
        idea: "An articulation point is a node that, if removed, disconnects the graph. Same discovery-time/low-value DFS as Bridges, with a slightly different check: node u is an articulation point if it has a child v where `low[v] >= disc[u]` (v can't reach back above u without going through u) — UNLESS u is the DFS root, which instead needs a special case: the root is an articulation point only if it has more than one child in the DFS tree.",
        time: "O(V + E)", space: "O(V)",
        code: `void dfs(int node, int parent, int& timer, vector<int>& disc, vector<int>& low,
         vector<vector<int>>& adj, vector<bool>& isArticulation) {
    disc[node] = low[node] = timer++;
    int children = 0;
    for (int neighbor : adj[node]) {
        if (neighbor == parent) continue;
        if (disc[neighbor] == -1) {
            children++;
            dfs(neighbor, node, timer, disc, low, adj, isArticulation);
            low[node] = min(low[node], low[neighbor]);
            if (parent != -1 && low[neighbor] >= disc[node]) isArticulation[node] = true;
        } else {
            low[node] = min(low[node], disc[neighbor]);
        }
    }
    if (parent == -1 && children > 1) isArticulation[node] = true; // root special case
}
vector<int> findArticulationPoints(int V, vector<vector<int>>& adj) {
    vector<int> disc(V, -1), low(V, -1);
    vector<bool> isArticulation(V, false);
    int timer = 0;
    for (int i = 0; i < V; i++) if (disc[i] == -1) dfs(i, -1, timer, disc, low, adj, isArticulation);
    vector<int> result;
    for (int i = 0; i < V; i++) if (isArticulation[i]) result.push_back(i);
    return result;
}`,
        variations: [],
        gotchas: ["The root-node special case (more than one DFS-tree child) is the detail almost everyone forgets — the general `low[v] >= disc[u]` check doesn't correctly apply to the root, since the root has no parent to disconnect from."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Representing connections, or visiting every reachable node", pattern: "graph-basics" },
  { keyword: "Flood-fill, count islands, or shortest distance on a grid", pattern: "graph-grid-traversal" },
  { keyword: "Does this graph have a cycle, or is it 2-colorable", pattern: "graph-cycles-bipartite" },
  { keyword: "What order should dependent tasks happen in", pattern: "graph-topo-sort" },
  { keyword: "Cheapest/shortest way between weighted nodes", pattern: "graph-shortest-path" },
  { keyword: "The 'graph' is hiding inside allowed moves between states", pattern: "implicit-graph-bfs" },
  { keyword: "Connect everything cheaply, or fast \"are these connected?\" checks", pattern: "graph-mst-dsu" },
  { keyword: "Which edge/node holds the graph together", pattern: "graph-scc-bridges" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.graphs = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();