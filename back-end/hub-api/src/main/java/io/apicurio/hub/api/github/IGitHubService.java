/*
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.hub.api.github;

import java.util.Collection;

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.exceptions.NotFoundException;

/**
 * @author eric.wittmann@gmail.com
 */
public interface IGitHubService {

    /**
     * Validates that the given repository URL can be resolved to a real resource
     * of an appropriate type.  Ensures that the resource is accessible, reads the
     * resource, extracts some basic information from the content.
     * @param repositoryUrl
     * @throws NotFoundException
     */
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException;

    /**
     * Fetchs information about the collaborators for a given repository resource.
     * This will iterate through all of the git commits for the given resource
     * and tally up commit counts for every user found.  The result is a collection
     * of all users who have contributed to the design.
     * @param repositoryUrl
     * @throws NotFoundException
     */
    public Collection<Collaborator> getCollaborators(String repositoryUrl) throws NotFoundException;

}
