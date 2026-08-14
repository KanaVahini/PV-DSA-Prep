// ============================================================
// DSA Binary Trees — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["trees"] so
// multiple topic files can coexist without clashing on names.
//
// Node shape used throughout:
// struct TreeNode { int val; TreeNode *left, *right; };
// ============================================================
(function () {

const TOPIC = {
  id: "trees",
  title: "Binary Trees",
  tagline: "Almost every tree problem is the same recursive question asked at every node: what do I need from my children to answer this myself?"
};

const PATTERNS = [
  {
    id: "tree-traversals",
    name: "Tree Traversals & Basics",
    color: "#66bb6a",
    icon: "tree-traversals",
    trigger: "Visiting every node in a specific order — the foundation everything else in this topic builds on",
    summary: "There are really only two ways to walk a tree: depth-first (go as deep as possible before backtracking — inorder/preorder/postorder are just different moments to 'visit' along that walk) or breadth-first (level by level, using a queue).",
    problems: [
      {
        name: "Introduction to Binary Trees",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/introduction-to-binary-tree/",
        idea: "A binary tree is a chain of nodes where each node points to at most two children — conventionally called `left` and `right`. Unlike a linked list, there's no single 'next' direction; every node is the root of its own smaller tree, which is exactly why almost every tree algorithm is written recursively: solve the problem for the left subtree, solve it for the right subtree, then combine those two answers at the current node.",
        time: "O(1) to create a node", space: "O(1) per node",
        code: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Building a small tree by hand:
//        1
//       / \\
//      2   3
TreeNode* root = new TreeNode(1);
root->left = new TreeNode(2);
root->right = new TreeNode(3);`,
        variations: [],
        gotchas: ["Every recursive tree function needs a base case for `nullptr` (an empty subtree) — forgetting it is the single most common tree-DSA bug."]
      },
      {
        name: "Inorder Traversal",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        idea: "Visit left subtree, then the current node, then right subtree. For a binary SEARCH tree specifically, this visits every value in sorted order — which is exactly why it's called 'inorder'.",
        time: "O(n)", space: "O(h) for the recursion stack, where h is the tree's height",
        code: `void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}
// Iterative version using an explicit stack:
vector<int> inorderIterative(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        result.push_back(cur->val);
        cur = cur->right;
    }
    return result;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Preorder Traversal",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
        idea: "Visit the current node FIRST, then the left subtree, then the right. This order is what you'd naturally get from printing a node the moment you arrive at it — useful whenever you need to recreate the tree's structure (like serialization), since a parent is always listed before its children.",
        time: "O(n)", space: "O(h)",
        code: `void preorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorder(root->left, result);
    preorder(root->right, result);
}
// Iterative version using an explicit stack:
vector<int> preorderIterative(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    stack<TreeNode*> st;
    st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        result.push_back(node->val);
        if (node->right) st.push(node->right); // push right first
        if (node->left) st.push(node->left);   // so left is popped first
    }
    return result;
}`,
        variations: [],
        gotchas: ["In the iterative version, push right before left — the stack's last-in-first-out order means left needs to go in last to come out first."]
      },
      {
        name: "Postorder Traversal",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/binary-tree-postorder-traversal/",
        idea: "Visit left, then right, then the current node LAST. This is the natural order for anything that needs to fully process both children before it can process itself — like deleting a tree node by node, or computing a value (height, sum) that depends on both subtrees being finished first.",
        time: "O(n)", space: "O(h)",
        code: `void postorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    postorder(root->left, result);
    postorder(root->right, result);
    result.push_back(root->val);
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Level Order Traversal (BFS)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        idea: "This is the one traversal that ISN'T depth-first. Use a queue: push the root, then repeatedly pop a node, record it, and push its children. Processing the queue in batches — recording how many nodes are in the queue before starting a batch — is what lets you group the output level by level instead of one flat list.",
        time: "O(n)", space: "O(n) for the queue in the worst case (a very wide tree)",
        code: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
        variations: [],
        gotchas: ["Capturing `levelSize` BEFORE the inner loop starts is essential — the queue's size keeps changing as you push children into it mid-loop."]
      },
      {
        name: "Preorder, Inorder, and Postorder in a Single Traversal",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/inorder-preorder-and-postorder-traversal-of-a-binary-tree-in-a-single-traversal/",
        idea: "Instead of walking the tree three separate times, push each node onto a stack alongside a small counter (1, 2, or 3) tracking which visit this is. The first time you see a node (counter 1), that's its preorder moment — push it back with counter 2 and go left. The second time (counter 2), that's its inorder moment — push it back with counter 3 and go right. The third time (counter 3), that's postorder — done with this node for good.",
        time: "O(n)", space: "O(h)",
        code: `void allThreeTraversals(TreeNode* root, vector<int>& pre, vector<int>& in, vector<int>& post) {
    if (!root) return;
    stack<pair<TreeNode*, int>> st;
    st.push({root, 1});
    while (!st.empty()) {
        auto& [node, state] = st.top();
        if (state == 1) {
            pre.push_back(node->val);
            state = 2;
            if (node->left) st.push({node->left, 1});
        } else if (state == 2) {
            in.push_back(node->val);
            state = 3;
            if (node->right) st.push({node->right, 1});
        } else {
            post.push_back(node->val);
            st.pop();
        }
    }
}`,
        variations: [],
        gotchas: ["Taking `node` and `state` by reference (`auto&`) from `st.top()` is what lets you update the state in place without popping and re-pushing every time."]
      }
    ]
  },

  {
    id: "tree-properties",
    name: "Tree Properties & Comparisons",
    color: "#42a5f5",
    icon: "tree-properties",
    trigger: "A yes/no question about the tree's shape, or a number describing it — height, balance, symmetry, sum, node count",
    summary: "Almost all of these ask each node 'what do you need from your two children to answer this about yourself?' — height needs max child height, balance needs child heights AND a balance flag, and so on.",
    problems: [
      {
        name: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        idea: "The depth of a tree is 1 (for the current node) plus whichever of its two subtrees is deeper. Ask each subtree its own depth recursively, then combine.",
        time: "O(n)", space: "O(h)",
        code: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Check if Two Trees Are Identical",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/same-tree/",
        idea: "Two trees are identical exactly when: both are empty (true, base case), or both nodes exist with the same value AND their left subtrees are identical AND their right subtrees are identical. If one tree has a node where the other doesn't, they're immediately different.",
        time: "O(n)", space: "O(h)",
        code: `bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q || p->val != q->val) return false;
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Check for Balanced Binary Tree",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/balanced-binary-tree/",
        idea: "A tree is height-balanced when, at EVERY node, the two subtrees' heights differ by at most 1. Computing height and checking balance separately is O(n²) in the worst case (recomputing heights over and over). Instead, do both in ONE bottom-up pass: return the height like normal, but if any subtree is already found to be unbalanced, short-circuit by returning a sentinel value (-1) that propagates straight up.",
        time: "O(n)", space: "O(h)",
        code: `int checkHeight(TreeNode* root) {
    if (!root) return 0;
    int left = checkHeight(root->left);
    if (left == -1) return -1; // already unbalanced below, stop checking
    int right = checkHeight(root->right);
    if (right == -1) return -1;
    if (abs(left - right) > 1) return -1; // unbalanced right here
    return 1 + max(left, right);
}
bool isBalanced(TreeNode* root) {
    return checkHeight(root) != -1;
}`,
        variations: [],
        gotchas: ["The naive version (a separate height() call inside every isBalanced() call) re-walks the same subtrees repeatedly, giving O(n²) — the sentinel-value trick is what gets this down to O(n)."]
      },
      {
        name: "Diameter of Binary Tree",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/diameter-of-binary-tree/",
        idea: "The diameter (longest path between any two nodes) doesn't have to pass through the root — it might be entirely within one subtree. But at EVERY node, the longest path THROUGH that node is `leftHeight + rightHeight`. So compute heights bottom-up as usual, and at each node, update a running global maximum with that node's left-height + right-height sum.",
        time: "O(n)", space: "O(h)",
        code: `int diameter = 0;
int height(TreeNode* root) {
    if (!root) return 0;
    int left = height(root->left);
    int right = height(root->right);
    diameter = max(diameter, left + right);
    return 1 + max(left, right);
}
int diameterOfBinaryTree(TreeNode* root) {
    diameter = 0;
    height(root);
    return diameter;
}`,
        variations: [],
        gotchas: ["The diameter is measured in EDGES between the two farthest nodes, not the number of nodes on the path — `left + right` (not `left + right + 1`) already accounts for this correctly."]
      },
      {
        name: "Binary Tree Maximum Path Sum",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        idea: "Same 'diameter' shape, but summing values with the option to go negative and prune. At each node, compute the best sum you could CONTRIBUTE upward to a parent (this node's value, plus whichever single child branch is better — or neither if both are negative). Separately, update a global maximum considering the path that goes through this node using BOTH children at once, since a path can only bend once (at its highest point) but can't branch further up.",
        time: "O(n)", space: "O(h)",
        code: `int best = INT_MIN;
int maxContribution(TreeNode* root) {
    if (!root) return 0;
    int leftGain = max(maxContribution(root->left), 0);   // ignore negative contributions
    int rightGain = max(maxContribution(root->right), 0);
    best = max(best, root->val + leftGain + rightGain);   // path bending through this node
    return root->val + max(leftGain, rightGain);          // what this node offers UPWARD
}
int maxPathSum(TreeNode* root) {
    best = INT_MIN;
    maxContribution(root);
    return best;
}`,
        variations: [],
        gotchas: ["A path being passed UP to a parent can only use ONE child branch (it can't fork) — using `max(leftGain, rightGain)` for the return value versus `leftGain + rightGain` for the global update is the key distinction."]
      },
      {
        name: "Check for Symmetric Binary Tree",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/symmetric-tree/",
        idea: "A tree is symmetric when its left and right subtrees are MIRROR images of each other — not identical, but reversed. Write a helper that checks if two subtrees are mirrors: their root values must match, the first's left must mirror the second's right, and the first's right must mirror the second's left (note the crossed pairing).",
        time: "O(n)", space: "O(h)",
        code: `bool isMirror(TreeNode* t1, TreeNode* t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2 || t1->val != t2->val) return false;
    return isMirror(t1->left, t2->right) && isMirror(t1->right, t2->left);
}
bool isSymmetric(TreeNode* root) {
    if (!root) return true;
    return isMirror(root->left, root->right);
}`,
        variations: [],
        gotchas: ["The crossed comparison (`t1->left` vs `t2->right`, and `t1->right` vs `t2->left`) is the whole trick — comparing straight across (`left` vs `left`) would check for identical subtrees, not mirrored ones."]
      },
      {
        name: "Count Total Nodes in a Complete Binary Tree",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/count-complete-tree-nodes/",
        idea: "A plain node-by-node count is O(n), ignoring the fact that the tree is COMPLETE (every level full except possibly the last, filled left to right). Exploit that: at any node, measure the height by always going left, and separately measure it by always going right. If those two heights are equal, the subtree is a PERFECT tree, so its node count is known instantly via a formula (2^height - 1) — no need to recurse into it at all. Only recurse into the (at most one) side that isn't perfect.",
        time: "O(log²n) — O(log n) levels, each doing an O(log n) height check", space: "O(log n)",
        code: `int leftHeight(TreeNode* node) {
    int h = 0;
    while (node) { h++; node = node->left; }
    return h;
}
int rightHeight(TreeNode* node) {
    int h = 0;
    while (node) { h++; node = node->right; }
    return h;
}
int countNodes(TreeNode* root) {
    if (!root) return 0;
    int lh = leftHeight(root), rh = rightHeight(root);
    if (lh == rh) return (1 << lh) - 1; // perfect subtree — formula, no recursion needed
    return 1 + countNodes(root->left) + countNodes(root->right);
}`,
        variations: [],
        gotchas: ["This trick specifically needs the tree to be COMPLETE (guaranteed by the problem) — on an arbitrary binary tree, the left/right height comparison doesn't reliably detect a perfect subtree."]
      }
    ]
  },

  {
    id: "tree-construction",
    name: "Tree Construction & Serialization",
    color: "#ffa726",
    icon: "tree-construction",
    trigger: "Build a tree back from traversal orders, or turn a tree into a string (and back) so it can be stored or sent somewhere",
    summary: "Preorder tells you where each subtree's root is; inorder tells you which values are to its left versus right. Combining the two lets you rebuild the whole structure recursively.",
    problems: [
      {
        name: "What's Needed to Construct a Unique Binary Tree",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/construct-a-binary-tree-from-postorder-and-inorder/",
        idea: "Preorder and postorder each tell you ONE thing: which node is the root (first element for preorder, last for postorder) — but neither tells you where the split between left and right subtrees falls, unless you also know inorder. Inorder is the key piece: once you know which value is the root, everything to its left in the inorder sequence belongs to the left subtree, and everything to its right belongs to the right subtree. That's why 'preorder + inorder' or 'postorder + inorder' can always uniquely rebuild a tree, but 'preorder + postorder' alone generally cannot (there can be multiple valid trees matching the same pair).",
        time: "N/A — conceptual", space: "N/A",
        code: `// Preorder + Inorder → unique tree: YES
// Postorder + Inorder → unique tree: YES
// Preorder + Postorder → unique tree: NOT always (ambiguous when a node has only one child)
//
// Why inorder is the essential ingredient: it's the only one of the three
// that actually separates "left subtree values" from "right subtree values"
// once you know where the root sits.`,
        variations: [],
        gotchas: []
      },
      {
        name: "Construct Binary Tree from Preorder and Inorder Traversal",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        idea: "The first element of preorder is always the current subtree's root. Find that value's position in inorder — everything before it belongs to the left subtree, everything after belongs to the right. Recurse on both halves, advancing through preorder as you go. A hashmap of value-to-inorder-index avoids a linear scan to find the split point every time.",
        time: "O(n)", space: "O(n)",
        code: `TreeNode* build(vector<int>& preorder, int& preIdx, int inStart, int inEnd, unordered_map<int,int>& inorderIndex) {
    if (inStart > inEnd) return nullptr;
    int rootVal = preorder[preIdx++];
    TreeNode* root = new TreeNode(rootVal);
    int mid = inorderIndex[rootVal];
    root->left = build(preorder, preIdx, inStart, mid - 1, inorderIndex);
    root->right = build(preorder, preIdx, mid + 1, inEnd, inorderIndex);
    return root;
}
TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int,int> inorderIndex;
    for (int i = 0; i < (int)inorder.size(); i++) inorderIndex[inorder[i]] = i;
    int preIdx = 0;
    return build(preorder, preIdx, 0, inorder.size() - 1, inorderIndex);
}`,
        variations: [],
        gotchas: ["Build the LEFT subtree before the right — `preIdx` must advance through the left subtree's nodes first, matching the order values actually appear in preorder."]
      },
      {
        name: "Construct Binary Tree from Postorder and Inorder Traversal",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
        idea: "Same idea as the preorder version, mirrored: the LAST element of postorder is the current subtree's root (not the first). Walk postorder backward, and build the RIGHT subtree before the left — since popping from the end of postorder gives you the root, then the right subtree's root, and so on.",
        time: "O(n)", space: "O(n)",
        code: `TreeNode* build(vector<int>& postorder, int& postIdx, int inStart, int inEnd, unordered_map<int,int>& inorderIndex) {
    if (inStart > inEnd) return nullptr;
    int rootVal = postorder[postIdx--];
    TreeNode* root = new TreeNode(rootVal);
    int mid = inorderIndex[rootVal];
    root->right = build(postorder, postIdx, mid + 1, inEnd, inorderIndex); // right built first
    root->left = build(postorder, postIdx, inStart, mid - 1, inorderIndex);
    return root;
}
TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
    unordered_map<int,int> inorderIndex;
    for (int i = 0; i < (int)inorder.size(); i++) inorderIndex[inorder[i]] = i;
    int postIdx = postorder.size() - 1;
    return build(postorder, postIdx, 0, inorder.size() - 1, inorderIndex);
}`,
        variations: [],
        gotchas: ["Building right-before-left (not left-before-right) here is the mirror-image detail that trips people up after having just learned the preorder version."]
      },
      {
        name: "Serialize and Deserialize Binary Tree",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        idea: "The cleanest approach: preorder traversal, but explicitly recording null children as a marker (like \"#\") instead of just skipping them. That extra information is exactly what's missing from a plain preorder list — with the nulls included, there's no ambiguity left, so rebuilding is just a straightforward recursive preorder reconstruction, consuming one token at a time.",
        time: "O(n) for both serialize and deserialize", space: "O(n)",
        code: `void serializeHelper(TreeNode* root, string& out) {
    if (!root) { out += "#,"; return; }
    out += to_string(root->val) + ",";
    serializeHelper(root->left, out);
    serializeHelper(root->right, out);
}
string serialize(TreeNode* root) {
    string out;
    serializeHelper(root, out);
    return out;
}
TreeNode* deserializeHelper(queue<string>& tokens) {
    string token = tokens.front(); tokens.pop();
    if (token == "#") return nullptr;
    TreeNode* node = new TreeNode(stoi(token));
    node->left = deserializeHelper(tokens);
    node->right = deserializeHelper(tokens);
    return node;
}
TreeNode* deserialize(string data) {
    queue<string> tokens;
    stringstream ss(data);
    string token;
    while (getline(ss, token, ',')) tokens.push(token);
    return deserializeHelper(tokens);
}`,
        variations: [],
        gotchas: ["Explicitly marking null children (instead of silently omitting them) is what makes preorder alone enough to reconstruct the tree — without those markers you'd need inorder too, just like in the construction problems above."]
      }
    ]
  },

  {
    id: "morris-traversal",
    name: "Morris Traversal (O(1) Space)",
    color: "#ba68c8",
    icon: "morris-traversal",
    trigger: "\"Traverse the tree without recursion AND without a stack\" — true O(1) extra space, the hard follow-up to the basic traversals",
    summary: "Recursion and stacks both use extra space to remember 'where to come back to.' Morris traversal avoids that entirely by temporarily borrowing empty right-child pointers to create a way back — then cleaning those temporary links up as it goes.",
    problems: [
      {
        name: "Morris Inorder Traversal",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/morris-traversal-for-inorder-traversal/",
        idea: "For a node with a left subtree, find that subtree's RIGHTMOST node (its inorder predecessor) — normally its right pointer is null. Temporarily point that null right pointer back at the current node, creating a 'thread' back up. Then dive left. When you arrive back at the current node via that thread, you know the entire left subtree has been visited — remove the thread (restoring the tree), visit the current node, and move right. If there's no left subtree at all, just visit the node immediately and move right.",
        time: "O(n) — each thread is created and removed exactly once", space: "O(1) extra, not counting the output",
        code: `vector<int> morrisInorder(TreeNode* root) {
    vector<int> result;
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            result.push_back(cur->val);
            cur = cur->right;
        } else {
            TreeNode* predecessor = cur->left;
            while (predecessor->right && predecessor->right != cur) predecessor = predecessor->right;
            if (!predecessor->right) {
                predecessor->right = cur; // create the thread
                cur = cur->left;
            } else {
                predecessor->right = nullptr; // remove the thread, tree restored
                result.push_back(cur->val);
                cur = cur->right;
            }
        }
    }
    return result;
}`,
        variations: [],
        gotchas: ["Always remove the temporary thread once you're done with it — leaving it behind corrupts the tree's actual structure for anything that uses it afterward."]
      },
      {
        name: "Morris Preorder Traversal",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/morris-traversal-for-preorder/",
        idea: "Same threading trick as Morris Inorder, with one change: visit the node the FIRST time you reach it (right when creating the thread), not the second time. Since preorder wants 'current node, then left, then right', recording the value before diving left (rather than after returning from it) is exactly what shifts inorder into preorder.",
        time: "O(n)", space: "O(1) extra",
        code: `vector<int> morrisPreorder(TreeNode* root) {
    vector<int> result;
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            result.push_back(cur->val);
            cur = cur->right;
        } else {
            TreeNode* predecessor = cur->left;
            while (predecessor->right && predecessor->right != cur) predecessor = predecessor->right;
            if (!predecessor->right) {
                result.push_back(cur->val); // visit BEFORE diving left — this is the preorder difference
                predecessor->right = cur;
                cur = cur->left;
            } else {
                predecessor->right = nullptr;
                cur = cur->right;
            }
        }
    }
    return result;
}`,
        variations: [],
        gotchas: ["Moving the `result.push_back` from the 'thread already exists' branch to the 'creating the thread' branch is the ONLY difference from Morris Inorder — everything else about the algorithm is identical."]
      }
    ]
  },

  {
    id: "tree-views",
    name: "Tree Views & Traversal Variants",
    color: "#26c6da",
    icon: "tree-views",
    trigger: "\"What does the tree look like from the top/bottom/side\" · zig-zag order · grouping nodes by column",
    summary: "Most of these are level-order traversal (BFS) with one extra piece of bookkeeping — a column index, a side flag, or alternating direction — layered on top.",
    problems: [
      {
        name: "Zig Zag (Spiral) Level Order Traversal",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
        idea: "Plain level order traversal, with one twist: alternate the direction you read each completed level in. Collect each level normally, then reverse every other level's list before adding it to the result.",
        time: "O(n)", space: "O(n)",
        code: `vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;
    while (!q.empty()) {
        int size = q.size();
        vector<int> level(size);
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            int idx = leftToRight ? i : size - 1 - i;
            level[idx] = node->val;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
        leftToRight = !leftToRight;
    }
    return result;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Boundary Traversal",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/boundary-traversal-of-binary-tree/",
        idea: "The boundary is three pieces glued together, each needing different care to avoid double-counting corners: the left edge from root to the first leaf (excluding the leaf itself), all leaves left-to-right (found via any traversal, keeping only leaf nodes), and the right edge from the last leaf back up to the root, reversed (also excluding the leaf).",
        time: "O(n)", space: "O(h)",
        code: `bool isLeaf(TreeNode* node) { return !node->left && !node->right; }

void addLeftBoundary(TreeNode* root, vector<int>& result) {
    TreeNode* cur = root->left;
    while (cur) {
        if (!isLeaf(cur)) result.push_back(cur->val);
        cur = cur->left ? cur->left : cur->right;
    }
}
void addLeaves(TreeNode* root, vector<int>& result) {
    if (!root) return;
    if (isLeaf(root)) { result.push_back(root->val); return; }
    addLeaves(root->left, result);
    addLeaves(root->right, result);
}
void addRightBoundary(TreeNode* root, vector<int>& result) {
    TreeNode* cur = root->right;
    vector<int> temp;
    while (cur) {
        if (!isLeaf(cur)) temp.push_back(cur->val);
        cur = cur->right ? cur->right : cur->left;
    }
    for (int i = temp.size() - 1; i >= 0; i--) result.push_back(temp[i]);
}
vector<int> boundaryTraversal(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    if (!isLeaf(root)) result.push_back(root->val);
    addLeftBoundary(root, result);
    addLeaves(root, result);
    addRightBoundary(root, result);
    return result;
}`,
        variations: [],
        gotchas: ["Each leaf must be included exactly once — the left/right boundary walks deliberately SKIP leaf nodes, since the separate leaves pass already covers every one of them."]
      },
      {
        name: "Vertical Order Traversal",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
        idea: "Assign every node a column index (root is 0, left child is parent's column - 1, right child is parent's column + 1) while doing a level-order (BFS) traversal so nodes are naturally grouped top-to-bottom within a column. Bucket nodes by column in a map; when multiple nodes land in the same column at the same row, sort those ties by value.",
        time: "O(n log n) due to the final sort", space: "O(n)",
        code: `vector<vector<int>> verticalTraversal(TreeNode* root) {
    map<int, map<int, multiset<int>>> columns; // column -> row -> sorted values
    queue<pair<TreeNode*, pair<int,int>>> q;   // node, {row, column}
    q.push({root, {0, 0}});
    while (!q.empty()) {
        auto [node, pos] = q.front(); q.pop();
        auto [row, col] = pos;
        columns[col][row].insert(node->val);
        if (node->left) q.push({node->left, {row + 1, col - 1}});
        if (node->right) q.push({node->right, {row + 1, col + 1}});
    }
    vector<vector<int>> result;
    for (auto& [col, rows] : columns) {
        vector<int> colValues;
        for (auto& [row, vals] : rows)
            colValues.insert(colValues.end(), vals.begin(), vals.end());
        result.push_back(colValues);
    }
    return result;
}`,
        variations: [],
        gotchas: ["A `std::map` keeps columns sorted by index automatically, and a `multiset` handles same-row ties by keeping values sorted — this problem is mostly about picking the right containers."]
      },
      {
        name: "Top View of Binary Tree",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/print-nodes-top-view-binary-tree/",
        idea: "Same column-index idea as vertical order, via BFS — but for each column, only keep the FIRST node encountered (since BFS visits level by level, the first node to reach any given column is the topmost one there).",
        time: "O(n log n)", space: "O(n)",
        code: `vector<int> topView(TreeNode* root) {
    map<int, int> firstAtColumn;
    queue<pair<TreeNode*, int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [node, col] = q.front(); q.pop();
        if (!firstAtColumn.count(col)) firstAtColumn[col] = node->val;
        if (node->left) q.push({node->left, col - 1});
        if (node->right) q.push({node->right, col + 1});
    }
    vector<int> result;
    for (auto& [col, val] : firstAtColumn) result.push_back(val);
    return result;
}`,
        variations: [],
        gotchas: ["Using BFS (not DFS) matters here — DFS could reach a deeper node in some column before a shallower one, giving the wrong 'topmost' answer."]
      },
      {
        name: "Bottom View of Binary Tree",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/bottom-view-binary-tree/",
        idea: "Exact same BFS + column-index approach as Top View, with one line flipped: instead of keeping only the FIRST node seen per column, keep OVERWRITING with every node seen — the last (deepest) one processed for each column naturally ends up as the final stored value.",
        time: "O(n log n)", space: "O(n)",
        code: `vector<int> bottomView(TreeNode* root) {
    map<int, int> lastAtColumn;
    queue<pair<TreeNode*, int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [node, col] = q.front(); q.pop();
        lastAtColumn[col] = node->val; // always overwrite
        if (node->left) q.push({node->left, col - 1});
        if (node->right) q.push({node->right, col + 1});
    }
    vector<int> result;
    for (auto& [col, val] : lastAtColumn) result.push_back(val);
    return result;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Right/Left View of Binary Tree",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/binary-tree-right-side-view/",
        idea: "This is level order traversal again, keeping only ONE node per level. For the right view, keep the LAST node visited in each level's row; for the left view, keep the FIRST. Level order naturally visits each row left-to-right, so this reduces to remembering the first or last value from each batch.",
        time: "O(n)", space: "O(n)",
        code: `vector<int> rightSideView(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            if (i == size - 1) result.push_back(node->val); // last node in this level
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return result;
}`,
        variations: ["Left view is identical, just check `i == 0` instead of `i == size - 1`."],
        gotchas: []
      }
    ]
  },

  {
    id: "tree-paths-ancestors",
    name: "Paths, Ancestors & Distances",
    color: "#ef5350",
    icon: "tree-paths-ancestors",
    trigger: "Questions about the ROUTE between nodes — root-to-leaf paths, common ancestors, distances, or spreading outward from a node",
    summary: "These are about relationships BETWEEN nodes rather than properties of a single node — usually solved by tracking a path as you recurse, or by first converting the tree into a graph you can search outward from.",
    problems: [
      {
        name: "Root to Leaf Paths",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/binary-tree-paths/",
        idea: "Do a DFS, maintaining the path taken so far as you go. The moment you reach a leaf (no children), the current path is complete — record a copy of it. Since you're using one shared list and backtracking (removing the current node before returning to the parent), each root-to-leaf path gets built and torn down as the recursion naturally unwinds.",
        time: "O(n)", space: "O(h) for the path, O(n) for the output",
        code: `void findPaths(TreeNode* node, vector<int>& path, vector<vector<int>>& allPaths) {
    if (!node) return;
    path.push_back(node->val);
    if (!node->left && !node->right) {
        allPaths.push_back(path);
    } else {
        findPaths(node->left, path, allPaths);
        findPaths(node->right, path, allPaths);
    }
    path.pop_back(); // backtrack — remove this node before returning to the parent
}
vector<vector<int>> binaryTreePaths(TreeNode* root) {
    vector<vector<int>> allPaths;
    vector<int> path;
    findPaths(root, path, allPaths);
    return allPaths;
}`,
        variations: [],
        gotchas: ["The `path.pop_back()` at the end is the backtracking step — skip it and every path after the first will incorrectly include nodes from earlier, unrelated branches."]
      },
      {
        name: "Lowest Common Ancestor in a Binary Tree",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        idea: "Search both subtrees for the two target nodes. If a subtree call finds neither target, it returns null. If it finds one target, it returns that node (bubbling the 'found' signal upward). The magic happens at whichever node gets a non-null result from BOTH its left and right searches — that means one target is in the left subtree and the other is in the right, so THIS node is exactly where their paths first meet: the lowest common ancestor.",
        time: "O(n)", space: "O(h)",
        code: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root; // p and q found on different sides — this is the LCA
    return left ? left : right;     // both were on the same side, or neither found yet
}`,
        variations: [],
        gotchas: ["If one of p or q is itself an ancestor of the other, this still works correctly — hitting either target node early causes an immediate return, which then propagates up as the answer."]
      },
      {
        name: "Maximum Width of Binary Tree",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-width-of-binary-tree/",
        idea: "The 'width' of a level is the distance between its leftmost and rightmost node, counting any missing nodes in between — like a complete binary tree's array indices. Assign each node an index the same way a heap array would (root = 0, left child = 2×parent+1, right child = 2×parent+2), track those indices during a level-order BFS, and the width of each level is simply (last index - first index + 1).",
        time: "O(n)", space: "O(n)",
        code: `int widthOfBinaryTree(TreeNode* root) {
    if (!root) return 0;
    int maxWidth = 0;
    queue<pair<TreeNode*, unsigned long long>> q; // node, index
    q.push({root, 0});
    while (!q.empty()) {
        int size = q.size();
        unsigned long long first = q.front().second, last = first;
        for (int i = 0; i < size; i++) {
            auto [node, idx] = q.front(); q.pop();
            last = idx;
            idx -= first; // re-baseline to prevent index overflow on deep trees
            if (node->left) q.push({node->left, 2 * idx});
            if (node->right) q.push({node->right, 2 * idx + 1});
        }
        maxWidth = max(maxWidth, (int)(last - first + 1));
    }
    return maxWidth;
}`,
        variations: [],
        gotchas: ["Re-baselining the index by subtracting `first` at every level is essential — without it, indices double at every level and overflow even a 64-bit integer on a moderately deep, unbalanced tree."]
      },
      {
        name: "Print All Nodes at Distance K from a Target Node",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
        idea: "A tree only lets you walk DOWNWARD naturally — but 'distance K' can mean going up through ancestors too. Fix that by first building a parent-pointer map with one DFS pass (every node now knows its parent). After that, it's just a graph BFS radiating outward from the target node in all three directions (left, right, AND parent), tracking visited nodes to avoid walking back the way you came.",
        time: "O(n)", space: "O(n)",
        code: `void mapParents(TreeNode* node, TreeNode* parent, unordered_map<TreeNode*, TreeNode*>& parentMap) {
    if (!node) return;
    parentMap[node] = parent;
    mapParents(node->left, node, parentMap);
    mapParents(node->right, node, parentMap);
}
vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    unordered_map<TreeNode*, TreeNode*> parentMap;
    mapParents(root, nullptr, parentMap);

    unordered_set<TreeNode*> visited;
    queue<TreeNode*> q;
    q.push(target);
    visited.insert(target);
    int distance = 0;
    while (!q.empty() && distance < k) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            for (TreeNode* neighbor : {node->left, node->right, parentMap[node]}) {
                if (neighbor && !visited.count(neighbor)) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }
        distance++;
    }
    vector<int> result;
    while (!q.empty()) { result.push_back(q.front()->val); q.pop(); }
    return result;
}`,
        variations: [],
        gotchas: ["Treating the tree as an undirected graph (via the parent map) once you've built it is the core insight — after that it's just plain BFS, nothing tree-specific left."]
      },
      {
        name: "Minimum Time to Burn a Binary Tree from a Given Node",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/burning-tree/",
        idea: "This is 'Nodes at Distance K' with a different question asked of the same setup: instead of finding nodes exactly K away, find the MAXIMUM distance from the start node to any other node (fire spreads outward one edge per minute in every direction, so the last node to catch fire is the farthest one). Same parent-map-then-BFS approach, just track how many rounds of BFS it takes to visit everything instead of stopping at a fixed K.",
        time: "O(n)", space: "O(n)",
        code: `int minTimeToBurn(TreeNode* root, TreeNode* target) {
    unordered_map<TreeNode*, TreeNode*> parentMap;
    mapParents(root, nullptr, parentMap); // same helper as Nodes at Distance K

    unordered_set<TreeNode*> visited;
    queue<TreeNode*> q;
    q.push(target);
    visited.insert(target);
    int minutes = -1;
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            for (TreeNode* neighbor : {node->left, node->right, parentMap[node]}) {
                if (neighbor && !visited.count(neighbor)) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }
        minutes++; // one full round of spreading = one minute
    }
    return minutes;
}`,
        variations: [],
        gotchas: ["Once you recognize this as 'the same BFS as Nodes at Distance K, just report how many rounds it took instead of stopping early,' the two problems become nearly identical code."]
      }
    ]
  },

  {
    id: "bst-basics",
    name: "BST Fundamentals & Operations",
    color: "#aed581",
    icon: "bst-basics",
    trigger: "A tree where every left subtree is smaller and every right subtree is bigger — search, insert, delete, or build one",
    summary: "A BST's one rule (left < node < right, everywhere) is what turns tree operations from O(n) into O(h) — at every node you can throw away an entire half of the remaining tree, the same way binary search throws away half an array.",
    problems: [
      {
        name: "Introduction to Binary Search Trees",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/binary-search-tree-data-structure/",
        idea: "A BST is a binary tree with one extra rule, applied at EVERY node, not just the root: everything in the left subtree is smaller than the node, and everything in the right subtree is bigger. That single rule is what makes searching, inserting, and deleting all O(h) instead of O(n) — at each node you instantly know which side to go to, discarding the other half. One useful side effect: an inorder traversal of a BST always visits values in sorted order.",
        time: "O(h) for search/insert/delete, where h is the tree's height", space: "O(1) per node",
        code: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
// Example valid BST:
//        8
//       / \\
//      3   10
//     / \\    \\
//    1   6    14
// Inorder traversal: 1, 3, 6, 8, 10, 14 — always sorted for a valid BST`,
        variations: [],
        gotchas: ["A balanced BST gives O(log n) operations, but a BST built from already-sorted input degrades into a straight line (essentially a linked list) with O(n) operations — the height guarantee depends entirely on how balanced the tree happens to be."]
      },
      {
        name: "Search in a BST",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
        idea: "At each node, compare the target to the current value: if it's smaller, the target can ONLY be in the left subtree (everything on the right is guaranteed bigger); if bigger, only the right subtree can contain it. Follow that single direction down instead of checking both sides, the same halving idea as binary search on an array.",
        time: "O(h)", space: "O(h) recursive, O(1) iterative",
        code: `TreeNode* searchBST(TreeNode* root, int val) {
    while (root && root->val != val) {
        root = (val < root->val) ? root->left : root->right;
    }
    return root;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Floor and Ceil in a BST",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/floor-and-ceil-from-a-bst/",
        idea: "Walk down the tree like a normal search. Every time the current node's value is ≤ the target, it's a CANDIDATE floor — record it, then keep looking further right for something even closer. Every time it's ≥ the target, it's a candidate ceil — record it, then keep looking further left. Whichever candidate you last recorded before falling off the tree is the answer.",
        time: "O(h)", space: "O(1)",
        code: `int floorInBST(TreeNode* root, int key) {
    int floor = -1;
    while (root) {
        if (root->val == key) return root->val;
        if (root->val < key) { floor = root->val; root = root->right; }
        else root = root->left;
    }
    return floor;
}
int ceilInBST(TreeNode* root, int key) {
    int ceil = -1;
    while (root) {
        if (root->val == key) return root->val;
        if (root->val > key) { ceil = root->val; root = root->left; }
        else root = root->right;
    }
    return ceil;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Insert a Node into a BST",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
        idea: "Walk down the tree following the same left/right rule as searching, until you fall off the tree (reach a null spot) — that null spot is exactly where the new value belongs, since the search path itself proves every ancestor's ordering rule is satisfied by placing it there.",
        time: "O(h)", space: "O(h) recursive, O(1) iterative",
        code: `TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);
    return root;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Delete a Node in a BST",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/delete-node-in-a-bst/",
        idea: "First find the node like a normal search. Deleting it has three cases: no children (just remove it), one child (replace it with that child), or two children — the tricky case, solved by replacing the node's value with its INORDER SUCCESSOR (the smallest value in its right subtree), then deleting that successor instead (which is guaranteed to have at most one child, falling back into an easier case).",
        time: "O(h)", space: "O(h)",
        code: `TreeNode* findMin(TreeNode* node) {
    while (node->left) node = node->left;
    return node;
}
TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        TreeNode* successor = findMin(root->right);
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
    }
    return root;
}`,
        variations: [],
        gotchas: ["Could just as validly use the inorder PREDECESSOR (largest value in the left subtree) instead of the successor — either works, just be consistent."]
      },
      {
        name: "Construct a BST from a Preorder Traversal",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
        idea: "Unlike a plain binary tree, a BST's structure is fully determined by ITS VALUES ALONE — no inorder traversal needed as a second input. Process preorder values one at a time, inserting each with the normal BST insert logic (or, faster, tracking an upper bound for each recursive call so you know when a value belongs to the current subtree versus a different branch entirely).",
        time: "O(n) with the bounded recursive approach, O(n²) worst case with naive repeated insertion", space: "O(h)",
        code: `TreeNode* buildBST(vector<int>& preorder, int& idx, int bound) {
    if (idx == (int)preorder.size() || preorder[idx] > bound) return nullptr;
    TreeNode* root = new TreeNode(preorder[idx++]);
    root->left = buildBST(preorder, idx, root->val);
    root->right = buildBST(preorder, idx, bound);
    return root;
}
TreeNode* bstFromPreorder(vector<int>& preorder) {
    int idx = 0;
    return buildBST(preorder, idx, INT_MAX);
}`,
        variations: [],
        gotchas: ["Passing a shrinking upper `bound` down through the recursion is what lets this build the tree in one O(n) pass — without it, you'd fall back to O(n²) repeated insertion."]
      }
    ]
  },

  {
    id: "bst-advanced",
    name: "BST Properties & Advanced Problems",
    color: "#f06292",
    icon: "bst-advanced",
    trigger: "Validate, iterate through, or repair a BST · find ranks/ancestors/pairs using the BST ordering property",
    summary: "These lean on the inorder-traversal-is-sorted fact from every angle — validating it, walking it lazily, finding neighbors within it, or noticing when it's been broken.",
    problems: [
      {
        name: "Check if a Tree Is a Valid BST",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/validate-binary-search-tree/",
        idea: "Checking only `node.left.val < node.val < node.right.val` at each node isn't enough — a node deep in the left subtree could still violate the rule against a distant ancestor, not just its direct parent. Instead, pass a valid (min, max) RANGE down through the recursion: every node must fall strictly within its inherited range, and each child narrows that range further (left child's max becomes the current value, right child's min becomes the current value).",
        time: "O(n)", space: "O(h)",
        code: `bool isValidBST(TreeNode* root, long minVal = LONG_MIN, long maxVal = LONG_MAX) {
    if (!root) return true;
    if (root->val <= minVal || root->val >= maxVal) return false;
    return isValidBST(root->left, minVal, root->val) && isValidBST(root->right, root->val, maxVal);
}`,
        variations: [],
        gotchas: ["Checking only against the immediate parent (instead of the full inherited range) is the classic wrong-but-tempting shortcut — it misses violations against grandparents and higher ancestors."]
      },
      {
        name: "Kth Smallest Element in a BST",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        idea: "Since inorder traversal visits BST values in sorted order, the Kth smallest value is simply the Kth value inorder traversal produces. Do an inorder walk, counting as you go, and stop the moment the count reaches k — no need to collect every value into a list first.",
        time: "O(h + k)", space: "O(h)",
        code: `int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        if (--k == 0) return cur->val;
        cur = cur->right;
    }
    return -1;
}`,
        variations: ["Kth Largest Element in a BST (identical idea, but traverse right-root-left instead of left-root-right)"],
        gotchas: []
      },
      {
        name: "Lowest Common Ancestor in a BST",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        idea: "The general Binary Tree LCA algorithm works here too, but the BST ordering property gives a much simpler O(h) approach: starting at the root, if BOTH targets are smaller than the current node, the LCA must be in the left subtree; if both are bigger, it's in the right subtree. The moment the targets split to different sides (or one equals the current node), that current node IS the LCA — their paths from the root just diverged right here.",
        time: "O(h)", space: "O(1) iterative",
        code: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) root = root->left;
        else if (p->val > root->val && q->val > root->val) root = root->right;
        else return root; // split point, or one target equals the current node
    }
    return nullptr;
}`,
        variations: [],
        gotchas: ["This is dramatically simpler than the general Binary Tree LCA — reaching for the harder recursive version out of habit, without noticing the BST property, is a common miss."]
      },
      {
        name: "Inorder Successor and Predecessor in a BST",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/inorder-predecessor-successor-given-key-bst/",
        idea: "The successor (next bigger value) and predecessor (next smaller value) can both be found in one O(h) walk each, without doing a full inorder traversal. For the successor: walk down, and every time you go LEFT (current node is bigger than the target), that node is a candidate successor — keep the last one recorded. Mirror the logic (go right, record candidates) for the predecessor.",
        time: "O(h)", space: "O(1)",
        code: `TreeNode* inorderSuccessor(TreeNode* root, int key) {
    TreeNode* successor = nullptr;
    while (root) {
        if (key < root->val) { successor = root; root = root->left; }
        else root = root->right;
    }
    return successor;
}
TreeNode* inorderPredecessor(TreeNode* root, int key) {
    TreeNode* predecessor = nullptr;
    while (root) {
        if (key > root->val) { predecessor = root; root = root->right; }
        else root = root->left;
    }
    return predecessor;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "BST Iterator",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/binary-search-tree-iterator/",
        idea: "Rather than doing a full inorder traversal upfront and storing every value (O(n) space), simulate the traversal LAZILY using an explicit stack. Push all left-children down to the leftmost node upfront; each `next()` call pops the top, and if that popped node has a right child, pushes that child and ITS leftmost chain — producing values one at a time in sorted order without ever materializing the full list.",
        time: "O(1) amortized per next()/hasNext() call", space: "O(h)",
        code: `class BSTIterator {
    stack<TreeNode*> st;
    void pushLeftChain(TreeNode* node) {
        while (node) { st.push(node); node = node->left; }
    }
public:
    BSTIterator(TreeNode* root) { pushLeftChain(root); }
    int next() {
        TreeNode* node = st.top(); st.pop();
        pushLeftChain(node->right);
        return node->val;
    }
    bool hasNext() { return !st.empty(); }
};`,
        variations: [],
        gotchas: ["This is the Morris-adjacent idea of 'traverse without doing all the work upfront' — the stack only ever holds O(h) nodes at a time, not the full tree."]
      },
      {
        name: "Two Sum in a BST",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
        idea: "This is the array Two Sum problem wearing a BST costume. The cleanest fix: do an inorder traversal to get all values in SORTED order (an array), then run the standard two-pointer sweep from both ends. Alternatively, a hash set works too — walk the tree in any order, and for each node check if `target - node.val` has already been seen.",
        time: "O(n)", space: "O(n)",
        code: `void inorder(TreeNode* root, vector<int>& values) {
    if (!root) return;
    inorder(root->left, values);
    values.push_back(root->val);
    inorder(root->right, values);
}
bool findTarget(TreeNode* root, int k) {
    vector<int> values;
    inorder(root, values);
    int l = 0, r = values.size() - 1;
    while (l < r) {
        int sum = values[l] + values[r];
        if (sum == k) return true;
        sum < k ? l++ : r--;
    }
    return false;
}`,
        variations: [],
        gotchas: ["Once converted to a sorted array via inorder traversal, this is IDENTICAL to the Two Pointers pattern's Two Sum II problem in the Arrays topic — same trick, different starting shape."]
      },
      {
        name: "Recover BST (Two Nodes Swapped)",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/recover-binary-search-tree/",
        idea: "Exactly two nodes have been swapped, breaking the sorted-inorder property at one or two places. Do an inorder traversal, comparing each value to the previous one — a 'dip' (current value smaller than previous) marks a violation. With one dip, the two swapped nodes are the two endpoints of that single dip. With two SEPARATE dips (the swapped nodes are farther apart in the traversal), the first violation's FIRST node and the second violation's SECOND node are the ones to swap back.",
        time: "O(n)", space: "O(h)",
        code: `void recoverTree(TreeNode* root) {
    TreeNode *first = nullptr, *second = nullptr, *prev = nullptr;
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        if (prev && prev->val > cur->val) {
            if (!first) first = prev;   // first violation's earlier node
            second = cur;               // always update — catches the second dip if it exists
        }
        prev = cur;
        cur = cur->right;
    }
    swap(first->val, second->val);
}`,
        variations: [],
        gotchas: ["`second` gets updated on EVERY dip found, not just the first — that's what correctly grabs the far-apart swapped node when the two violations occur in two separate places in the traversal."]
      },
      {
        name: "Largest BST Subtree in a Binary Tree",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/find-the-largest-subtree-in-a-tree-that-is-also-a-bst/",
        idea: "For each node, you need to know from its children: are they valid BSTs, and if so, what's their min/max value and size? Do this bottom-up in one post-order pass — each node returns a small struct (isBST, min, max, size). A node combines its children's info: it forms a valid BST itself only if both children are valid BSTs AND its own value fits between the left child's max and the right child's min. Track the largest valid BST size seen anywhere during this single pass.",
        time: "O(n)", space: "O(h)",
        code: `struct Info { bool isBST; int minVal, maxVal, size; };
int best = 0;
Info largestBSTHelper(TreeNode* root) {
    if (!root) return {true, INT_MAX, INT_MIN, 0};
    Info left = largestBSTHelper(root->left);
    Info right = largestBSTHelper(root->right);
    if (left.isBST && right.isBST && root->val > left.maxVal && root->val < right.minVal) {
        int size = left.size + right.size + 1;
        best = max(best, size);
        return {true, min(left.minVal, root->val), max(right.maxVal, root->val), size};
    }
    return {false, 0, 0, 0}; // not a valid BST — values don't matter once isBST is false
}
int largestBSTSubtree(TreeNode* root) {
    best = 0;
    largestBSTHelper(root);
    return best;
}`,
        variations: [],
        gotchas: ["This is functionally the 'Balanced Binary Tree' trick again — computing everything needed in a single bottom-up pass instead of a separate O(n) validity check per node, which would give a much slower O(n²)."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Visit every node in a specific order", pattern: "tree-traversals" },
  { keyword: "Height, balance, symmetry, or a yes/no about the shape", pattern: "tree-properties" },
  { keyword: "Rebuild a tree from traversal orders, or serialize it", pattern: "tree-construction" },
  { keyword: "Traverse with zero extra memory, no stack or recursion", pattern: "morris-traversal" },
  { keyword: "What the tree looks like from the top/bottom/side", pattern: "tree-views" },
  { keyword: "Paths, common ancestors, or spreading outward from a node", pattern: "tree-paths-ancestors" },
  { keyword: "Search, insert, delete, or build a BST", pattern: "bst-basics" },
  { keyword: "Validate, iterate through, or repair a BST", pattern: "bst-advanced" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.trees = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();